const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch shared packages for live reload
const packagesDir = path.resolve(monorepoRoot, 'packages');
config.watchFolders = fs
  .readdirSync(packagesDir)
  .map((name) => path.resolve(packagesDir, name));

// With hoisted node_modules, everything is in monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
