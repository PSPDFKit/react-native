#!/usr/bin/env node
/**
 * Creates a patch-package patch for @nutrient-sdk/react-native from the app root.
 * Run this after bridging native APIs and testing, when the user wants to commit
 * their changes so they reapply on every install.
 *
 * Usage:
 *   From app root (recommended):
 *     node node_modules/@nutrient-sdk/react-native/scripts/create-bridge-patch.js
 *
 *   From SDK repo (e.g. after dev-build, with Catalog):
 *     node scripts/create-bridge-patch.js samples/Catalog
 *
 * The script will:
 * 1. Ensure patch-package is in devDependencies and postinstall is in scripts.
 * 2. Run patch-package to create/update patches/@nutrient-sdk+react-native+*.patch
 * 3. Tell you to commit the patches/ directory.
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const PACKAGE_NAME = '@nutrient-sdk/react-native';

function findAppRoot() {
  const arg = process.argv[2];
  if (arg) {
    const appRoot = path.resolve(process.cwd(), arg);
    if (!fs.existsSync(path.join(appRoot, 'package.json'))) {
      console.error('Error: No package.json at', appRoot);
      process.exit(1);
    }
    return appRoot;
  }
  // Assume we're in node_modules/@nutrient-sdk/react-native/scripts
  const scriptDir = __dirname;
  const appRoot = path.resolve(scriptDir, '..', '..', '..');
  if (!fs.existsSync(path.join(appRoot, 'package.json'))) {
    console.error(
      'Error: Could not find app root (expected package.json at ' +
        appRoot +
        '). Run from your app root: node node_modules/@nutrient-sdk/react-native/scripts/create-bridge-patch.js\n' +
        'Or from SDK repo: node scripts/create-bridge-patch.js <app-path>'
    );
    process.exit(1);
  }
  return appRoot;
}

function ensurePatchPackageSetup(appRoot) {
  const pkgPath = path.join(appRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  let changed = false;

  if (!pkg.devDependencies) pkg.devDependencies = {};
  if (!pkg.devDependencies['patch-package']) {
    pkg.devDependencies['patch-package'] = '^8.0.0';
    changed = true;
  }

  if (!pkg.scripts) pkg.scripts = {};
  if (pkg.scripts.postinstall !== 'patch-package') {
    pkg.scripts.postinstall = 'patch-package';
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('Added patch-package and postinstall to package.json.');
    console.log('Running npm install...');
    execSync('npm install', { cwd: appRoot, stdio: 'inherit' });
  }
}

function createPatch(appRoot) {
  console.log('Creating patch for', PACKAGE_NAME + '...');
  execSync(`npx patch-package ${PACKAGE_NAME}`, {
    cwd: appRoot,
    stdio: 'inherit',
  });
}

function main() {
  const appRoot = findAppRoot();
  console.log('App root:', appRoot);

  ensurePatchPackageSetup(appRoot);
  createPatch(appRoot);

  console.log('\nDone. Commit the patches/ directory to source control so the patch is reapplied on every npm install / yarn install.');
}

main();
