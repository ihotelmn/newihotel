const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const rootModules = path.resolve(monorepoRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// Watch shared packages for live reload
const packagesDir = path.resolve(monorepoRoot, 'packages');
config.watchFolders = fs
  .readdirSync(packagesDir)
  .map((name) => path.resolve(packagesDir, name));

// With hoisted node_modules, everything is in monorepo root
config.resolver.nodeModulesPaths = [rootModules];

// Force react and react-native to always resolve to ONE copy from root.
// Nested copies inside react-native/, @react-native/, etc. cause
// "Invalid hook call" / "useId of null" runtime crashes.
const reactPath = path.resolve(rootModules, 'react');
const rnPath = path.resolve(rootModules, 'react-native');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName === 'react/jsx-runtime' || moduleName === 'react/jsx-dev-runtime') {
    const subpath = moduleName === 'react' ? '' : moduleName.replace('react', '');
    return context.resolveRequest(
      { ...context, originModulePath: path.join(reactPath, 'package.json') },
      '.' + subpath,
      platform,
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
