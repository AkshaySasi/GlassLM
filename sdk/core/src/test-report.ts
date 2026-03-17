/**
 * GlassLM Masking Stats Report Generator
 * 
 * Run with: npx tsx src/test-report.ts
 * 
 * Produces a per-category masking detection report with:
 *  - Test count per category
 *  - Detection rate (%)
 *  - Overall rate
 *  - JSON file saved as masking-stats.json for homepage/marketing use
 */

import { autoMask } from './masker';
import { isValidLuhn } from './contextAnalyzer';
import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────
// Type definitions
// ─────────────────────────────────────────────────────
type TestCase = {
    input: string;
    shouldDetect: boolean;
    type: string;
};

type CategoryReport = {
    category: string;
    label: string;
    total: number;
    detected: number;
    missed: number;
    falsePositives: number;
    detectionRate: number;
    falsePositiveRate: number;
};

// ─────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────
const TEST_CASES: TestCase[] = [
    // --- EMAIL ---
    { input: 'Send a message to user@example.com please', shouldDetect: true, type: 'email' },
    { input: 'first.last+tag@sub.domain.org is my email', shouldDetect: true, type: 'email' },
    { input: 'Contact admin@glasslm.io', shouldDetect: true, type: 'email' },
    { input: 'info@company.co.uk', shouldDetect: true, type: 'email' },
    { input: 'test_user123@my-site.net', shouldDetect: true, type: 'email' },
    { input: 'no-reply@finance.bank.com', shouldDetect: true, type: 'email' },
    { input: 'john.doe@gmail.com', shouldDetect: true, type: 'email' },
    { input: 'jane_doe@yahoo.co.in is our contact', shouldDetect: true, type: 'email' },
    // false positive test
    { input: 'Follow us @glasslm on Twitter', shouldDetect: false, type: 'email' },

    // --- PHONE ---
    { input: 'Call me at +1 (800) 555-1234', shouldDetect: true, type: 'phone' },
    { input: 'My number is 800-555-1234', shouldDetect: true, type: 'phone' },
    { input: 'Reach me: 8005551234', shouldDetect: true, type: 'phone' },
    { input: 'Contact: (415) 234-5678', shouldDetect: true, type: 'phone' },
    { input: 'Hotline 1-800-222-3333', shouldDetect: true, type: 'phone' },
    { input: 'Office: 212.555.4321', shouldDetect: true, type: 'phone' },
    { input: 'Emergency: (312) 555-7890', shouldDetect: true, type: 'phone' },

    // --- SSN ---
    { input: 'SSN: 123-45-6789', shouldDetect: true, type: 'ssn' },
    { input: 'SSN: 000-00-0001', shouldDetect: true, type: 'ssn' },
    { input: 'SSN: 999-99-9999', shouldDetect: true, type: 'ssn' },
    { input: 'SSN: 987-65-4321', shouldDetect: true, type: 'ssn' },
    { input: 'Your SSN is 456-78-9012', shouldDetect: true, type: 'ssn' },
    // false positive
    { input: 'Order ref 1234-56-789', shouldDetect: false, type: 'ssn' },

    // --- CREDIT CARD ---
    { input: 'Card: 4532015112830366', shouldDetect: true, type: 'credit_card' },
    { input: 'Card: 4532 0151 1283 0366', shouldDetect: true, type: 'credit_card' },
    { input: 'My card: 5425233430109903', shouldDetect: true, type: 'credit_card' },
    { input: 'Discover: 6011111111111117', shouldDetect: true, type: 'credit_card' },
    { input: 'Visa: 4111-1111-1111-1111', shouldDetect: true, type: 'credit_card' },
    // invalid luhn - should NOT detect
    { input: 'Number: 1234 5678 9012 3456', shouldDetect: false, type: 'credit_card' },

    // --- API KEY ---
    { input: 'sk-abcdefghij1234567890 is my key', shouldDetect: true, type: 'api_key' },
    { input: 'pk-live_XXXXXXXXXXXXXXXXXXXX', shouldDetect: true, type: 'api_key' },
    { input: 'API KEY: AbCdEfGhIjKlMnOpQrSt', shouldDetect: true, type: 'api_key' },
    { input: 'API_KEY=abc123def456ghi789jkl0', shouldDetect: true, type: 'api_key' },
    { input: 'My API key is AbCdEfGhIjKlMnOp', shouldDetect: true, type: 'api_key' },
    { input: 'x-api-key: abc123XYZ789abcdefXYZ', shouldDetect: true, type: 'api_key' },
    { input: 'api_key: mySecretKey1234567890XYZ', shouldDetect: true, type: 'api_key' },
    { input: 'Authorization api key: ABCDEFGHIJ1234', shouldDetect: true, type: 'api_key' },
    // false positive
    { input: 'Code: ABC123', shouldDetect: false, type: 'api_key' },

    // --- ACCESS TOKEN (JWT / Bearer) ---
    {
        input: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        shouldDetect: true,
        type: 'access_token'
    },
    {
        input: 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123',
        shouldDetect: true,
        type: 'access_token'
    },
    { input: 'Bearer abcdefghijklmnopqrstuvwxyz12345678', shouldDetect: true, type: 'access_token' },
    { input: 'Token ghp_16C7e42F292c6912E7710c838347Ae178B4a', shouldDetect: true, type: 'access_token' },
    { input: 'Authorization: Bearer ya29.a0AbVbY6XXXXX_abc123', shouldDetect: true, type: 'access_token' },

    // --- CLOUD CREDENTIAL ---
    { input: 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE', shouldDetect: true, type: 'cloud_credential' },
    { input: 'Access key: AKIAI44QH8DHBEXAMPLE', shouldDetect: true, type: 'cloud_credential' },
    { input: 'key: AKIAJSIE27AJUHGN4UPA', shouldDetect: true, type: 'cloud_credential' },
    // false positive
    { input: 'Code: AKIA12345', shouldDetect: false, type: 'cloud_credential' },

    // --- PRIVATE KEY ---
    {
        input: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z3VS5JJcds3ExampleKeyDataBase64EncodedKeyDataHere\n-----END RSA PRIVATE KEY-----',
        shouldDetect: true,
        type: 'private_key'
    },
    {
        input: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAExampleKeyData==\n-----END PRIVATE KEY-----',
        shouldDetect: true,
        type: 'private_key'
    },
    // not a private key
    { input: '-----BEGIN CERTIFICATE-----\nMIIBITANBgk=\n-----END CERTIFICATE-----', shouldDetect: false, type: 'private_key' },

    // --- DATABASE URL ---
    { input: 'DB: postgresql://admin:secretpass@db.host.com:5432/mydb', shouldDetect: true, type: 'database_url' },
    { input: 'DB: postgres://user:pw@localhost/prod_db', shouldDetect: true, type: 'database_url' },
    { input: 'mysql://root:password@10.0.0.1:3306/app', shouldDetect: true, type: 'database_url' },
    { input: 'mongodb://user:pass@cluster0.mongodb.net/dbname', shouldDetect: true, type: 'database_url' },
    { input: 'mongodb+srv://admin:pass@cluster.mongodb.net/?retryWrites=true', shouldDetect: true, type: 'database_url' },

    // --- IP ADDRESS ---
    { input: 'Server IP: 192.168.1.1', shouldDetect: true, type: 'ip_address' },
    { input: 'Gateway: 10.0.0.1', shouldDetect: true, type: 'ip_address' },
    { input: 'Host: 172.16.254.1', shouldDetect: true, type: 'ip_address' },
    { input: 'DNS: 8.8.8.8', shouldDetect: true, type: 'ip_address' },
    { input: 'Broadcast: 255.255.255.0', shouldDetect: true, type: 'ip_address' },
    { input: 'IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334', shouldDetect: true, type: 'ip_address' },
    { input: 'IPv6 host: fe80:0000:0000:0000:0202:b3ff:fe1e:8329', shouldDetect: true, type: 'ip_address' },
];

// ─────────────────────────────────────────────────────
// Labels
// ─────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
    email: 'Email Addresses',
    phone: 'Phone Numbers',
    ssn: 'Social Security Numbers',
    credit_card: 'Credit Card Numbers',
    api_key: 'API Keys',
    access_token: 'Access Tokens (JWT/Bearer)',
    cloud_credential: 'Cloud Credentials (AWS)',
    private_key: 'Private Keys (PEM)',
    database_url: 'Database URLs',
    ip_address: 'IP Addresses (v4/v6)',
};

// ─────────────────────────────────────────────────────
// Run Tests
// ─────────────────────────────────────────────────────
function runAllTests(): CategoryReport[] {
    const stats: Record<string, { total: number; detected: number; missed: number; falsePositives: number }> = {};

    for (const { input, shouldDetect, type } of TEST_CASES) {
        if (!stats[type]) {
            stats[type] = { total: 0, detected: 0, missed: 0, falsePositives: 0 };
        }
        stats[type].total++;

        const { maskedItems } = autoMask(input);
        const detected = maskedItems.some(i => i.type === type);

        if (shouldDetect && detected) {
            stats[type].detected++;
        } else if (shouldDetect && !detected) {
            stats[type].missed++;
        } else if (!shouldDetect && detected) {
            stats[type].falsePositives++;
        }
        // true negative: shouldDetect=false, detected=false → correct, no action needed
    }

    return Object.entries(stats).map(([category, s]) => {
        const positives = TEST_CASES.filter(t => t.type === category && t.shouldDetect).length;
        const detectionRate = positives > 0 ? (s.detected / positives) * 100 : 100;
        const fpTotal = TEST_CASES.filter(t => t.type === category && !t.shouldDetect).length;
        const falsePositiveRate = fpTotal > 0 ? (s.falsePositives / fpTotal) * 100 : 0;

        return {
            category,
            label: CATEGORY_LABELS[category] ?? category,
            total: s.total,
            detected: s.detected,
            missed: s.missed,
            falsePositives: s.falsePositives,
            detectionRate: Math.round(detectionRate * 10) / 10,
            falsePositiveRate: Math.round(falsePositiveRate * 10) / 10,
        };
    });
}

// ─────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────
function main() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║          G L A S S L M   M A S K I N G   S T A T S              ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log(`   Generated: ${new Date().toISOString()}\n`);

    const results = runAllTests();

    // Sort by detection rate descending
    results.sort((a, b) => b.detectionRate - a.detectionRate);

    // Print table
    const pad = (s: string | number, n: number) => String(s).padEnd(n);
    const rpad = (s: string | number, n: number) => String(s).padStart(n);

    console.log('┌─────────────────────────────────────┬───────┬──────────┬──────────┬────────────┐');
    console.log('│ Category                            │ Tests │ Detected │  Missed  │  Det. Rate │');
    console.log('├─────────────────────────────────────┼───────┼──────────┼──────────┼────────────┤');

    let totalTests = 0, totalDetected = 0, totalPositives = 0;

    for (const r of results) {
        const positive = TEST_CASES.filter(t => t.type === r.category && t.shouldDetect).length;
        totalTests += r.total;
        totalDetected += r.detected;
        totalPositives += positive;

        const rateStr = `${r.detectionRate}%`;
        const bar = '█'.repeat(Math.round(r.detectionRate / 10)) + '░'.repeat(10 - Math.round(r.detectionRate / 10));
        console.log(
            `│ ${pad(r.label, 35)} │ ${rpad(r.total, 5)} │ ${rpad(r.detected, 8)} │ ${rpad(r.missed, 8)} │ ${rpad(rateStr, 6)} ${bar} │`
        );
    }

    console.log('├─────────────────────────────────────┼───────┼──────────┼──────────┼────────────┤');
    const overallRate = Math.round((totalDetected / totalPositives) * 1000) / 10;
    console.log(
        `│ ${pad('🛡  OVERALL', 35)} │ ${rpad(totalTests, 5)} │ ${rpad(totalDetected, 8)} │ ${rpad(totalPositives - totalDetected, 8)} │ ${rpad(overallRate + '%', 6)} ${'█'.repeat(Math.round(overallRate / 10))}${'░'.repeat(10 - Math.round(overallRate / 10))} │`
    );
    console.log('└─────────────────────────────────────┴───────┴──────────┴──────────┴────────────┘');

    // Marketing summary
    const highRateCategories = results.filter(r => r.detectionRate >= 90);
    console.log(`\n✅ ${highRateCategories.length}/${results.length} categories at 90%+ detection rate`);
    console.log(`🛡  Overall sensitive-data masking rate: ${overallRate}%`);
    console.log(`📊 Total test cases run: ${totalTests}`);

    // Build JSON for homepage
    const marketingJson = {
        generated: new Date().toISOString(),
        overallMaskingRate: overallRate,
        totalTestCases: totalTests,
        categoriesAbove90Percent: highRateCategories.length,
        totalCategories: results.length,
        categories: results.map(r => ({
            id: r.category,
            label: r.label,
            detectionRate: r.detectionRate,
            testsRun: r.total,
            detected: r.detected,
        })),
        marketingStats: {
            headline: `${overallRate}% Masking Accuracy`,
            subheadline: `Tested across ${results.length} sensitive data categories`,
            badges: [
                { label: 'API Keys', value: `${results.find(r => r.category === 'api_key')?.detectionRate ?? 0}%` },
                { label: 'PII Data', value: `${results.filter(r => ['email', 'phone', 'ssn', 'credit_card'].includes(r.category)).reduce((acc, r) => acc + r.detectionRate, 0) / 4 | 0}%` },
                { label: 'Credentials', value: `${results.find(r => r.category === 'cloud_credential')?.detectionRate ?? 0}%` },
                { label: 'DB URLs', value: `${results.find(r => r.category === 'database_url')?.detectionRate ?? 0}%` },
            ]
        }
    };

    // Save JSON
    const outputPath = path.join(__dirname, '..', 'masking-stats.json');
    fs.writeFileSync(outputPath, JSON.stringify(marketingJson, null, 2));
    console.log(`\n💾 Stats saved to: masking-stats.json`);
    console.log('   Use this file in your homepage/marketing copy!\n');
}

main();
