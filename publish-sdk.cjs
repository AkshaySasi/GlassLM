const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(msg) {
    console.log(`\n\x1b[36m${msg}\x1b[0m`); // Cyan text
}

function run(cmd, cwd) {
    console.log(`> ${cmd}`);
    execSync(cmd, { cwd: cwd || process.cwd(), stdio: 'inherit' });
}

function updateDependencyVersion(pkgPath, depName, version) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.dependencies && pkg.dependencies[depName]) {
        pkg.dependencies[depName] = version;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        log(`Updated ${depName} to ${version} in ${path.basename(path.dirname(pkgPath))}`);
    }
}

try {
    const rootDir = process.cwd();
    const coreDir = path.join(rootDir, 'sdk', 'core');
    const nodeDir = path.join(rootDir, 'sdk', 'node');
    const webDir = path.join(rootDir, 'sdk', 'web');

    log('1. Building SDKs...');
    run('npx tsc -b sdk/core/tsconfig.json sdk/node/tsconfig.json sdk/web/tsconfig.json');

    log('2. Preparing package.json files for publishing (Setting @glasslm/core version)...');
    // Temporarily update dependencies to use version numbers instead of file: paths
    updateDependencyVersion(path.join(nodeDir, 'package.json'), '@glasslm/core', '^0.1.0');
    updateDependencyVersion(path.join(webDir, 'package.json'), '@glasslm/core', '^0.1.0');

    log('3. Publishing @glasslm/core...');
    run('npm publish --access public', coreDir);

    log('4. Publishing @glasslm/node...');
    run('npm publish --access public', nodeDir);

    log('5. Publishing @glasslm/web...');
    run('npm publish --access public', webDir);

    log('SUCCESS: All packages published!');

} catch (error) {
    console.error('\n\x1b[31mPublishing failed!\x1b[0m');
    console.error('Ensure you are logged in (npm login) and own the @glasslm organization.');
    console.error(error.message);

    // Attempt rollback of package.json changes
    try {
        log('Rolling back package.json changes...');
        const rootDir = process.cwd();
        updateDependencyVersion(path.join(rootDir, 'sdk', 'node', 'package.json'), '@glasslm/core', 'file:../core');
        updateDependencyVersion(path.join(rootDir, 'sdk', 'web', 'package.json'), '@glasslm/core', 'file:../core');
    } catch (e) {
        console.error('Rollback failed:', e.message);
    }
}
