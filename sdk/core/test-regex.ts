import { autoMask } from './src/masker.ts';
console.log('CREDIT CARD:');
console.log(autoMask('My card number is 4532015112830366'));

console.log('PHONE:');
console.log(autoMask('Call me at +1 (800) 555-1234'));

console.log('PRIVATE KEY:');
console.log(autoMask('Here is my key:\n-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z3VS5JJcds3\n-----END RSA PRIVATE KEY-----'));
