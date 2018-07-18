#!/usr/bin/env node

const glob = require('glob');
const fs = require('fs');
const PATH = require('path');

require('./../boot').then(function () {
  const args = sys.get('core/Command').args(':command(/:extension)');

  if (args === null) return;

  const config = sys.get('core/Config');
  const manager = sys.get('core/ExtensionManager');

  const system = config.get('kernal.system', {
    theme: [],
    module: [],
  });

  const info = manager.getInfo(args.extension);

  switch (args.command) {
    case 'en':
      if (info === null) {
        console.error('No extension found with name "' + args.extension + '".');
        console.error('Use "ext.js register" to register new extensions.');
        return;
      }

      if (info.enabled) {
        console.warn('Extension "' + args.extension + '" is already enabled.');
        return;
      }

      const enable_result = enable(system, config, manager, info);

      if (enable_result) {
        console.log('SUCCESS:', 'Enabled', info.type, info.name, '(' + info.key + ')');
      } else {
        console.error('FAILED:', 'Enabled', info.type, info.name, '(' + info.key + ')');
      }

      return;
    case 'dis':
      if (info === null) {
        console.error('No extension found with name "' + args.extension + '".');
        console.error('Use "ext.js register" to register new extensions.');
        return;
      }

      if (!info.enabled) {
        console.warn('Extension "' + args.extension + '" is already disabled.');
        return;
      }

      const disable_result = disable(system, config, manager, info);

      if (disable_result) {
        console.log('SUCCESS:', 'Disabled', info.type, info.name, '(' + info.key + ')');
      } else {
        console.error('FAILED:', 'Disabled', info.type, info.name, '(' + info.key + ')');
      }

      return;
    case 'info':
      if (info === null) {
        console.error('No extension found with name "' + args.extension + '".');
        console.error('Use "ext.js register" to register new extensions.');
        return;
      }

      console.log(JSON.stringify(info, null, '  '));
      return;

    case 'register':
      console.log('REGISTER: Extensions');
      const extensions = {
        module: {},
        theme: {},
      };

      console.log('SCAN THEMES...');
      const themes = glob.sync('**/*.theme.json', {
        cwd: use._root + '/sys',
      });

      for (const theme of themes) {
        const basename = PATH.basename(theme);
        const name = basename.slice(0, -11);

        extensions.theme[name] = require(use._root + '/sys/' + theme);
        extensions.theme[name].path = theme.slice(0, - (basename.length + 1));
        extensions.theme[name].type = 'theme';
        extensions.theme[name].key = name;
        console.log('REGISTER:', 'theme', name);
      }

      console.log('SCAN MODULES...');
      const modules = glob.sync('**/*.module.json', {
        cwd: use._root + '/sys',
      });

      for (const module of modules) {
        const basename = PATH.basename(module);
        const name = basename.slice(0, -12);

        extensions.module[name] = require(use._root + '/sys/' + module);
        extensions.module[name].path = module.slice(0, - (basename.length + 1));
        extensions.module[name].type = 'module';
        extensions.module[name].key = name;
        console.log('REGISTER:', 'module', name);
      }

      config.set('extensions', extensions);
      console.log('SUCCESS: Register extensions');
      return;

    default:
      console.error('Unknown command! Allowed values: (en|dis|info|register).');
      return;
  }

});

function getDependencies(manager, info, order, map) {
  if (info.enabled) return true;

  if (info.dependencies) {
    for (const dependencie of info.dependencies) {
      const dependencie_info = manager.getInfo(dependencie);

      if (dependencie_info === null) {
        console.error('No extension found with name "' + dependencie + '" for dependencie of "' + info.key + '".');
        console.error('Use "ext.js register" to register new extensions.');
        return false;
      }
      const result = getDependencies(manager, dependencie_info, order, map);

      if (!result) return false;
    }
  }
  if (order.indexOf(info.key) === -1) {
    order.push(info.key);
    console.log('SCAN DEPENDENCIE:', 'Relevant dependencie', info.key);
  }
  map[info.key] = info;
  return true;
}

function enable(system, config, manager, info) {
  console.log('TRY ENABLE:', info.type, info.name, '(' + info.key + ')');
  const order = [];
  const map = {};
  const result = getDependencies(manager, info, order, map);

  if (!result) return false;

  for (const name of order) {
    doEnable(system, config, map[name]);
  }
  return true;
}

function doEnable(system, config, info) {
  system[info.type].push(info.key);

  console.log('ENABLE EXTENSION:', info.type, info.name, '(' + info.key + ')');

  const en_files = glob.sync('**/*.json', {
    cwd: use._root + '/sys/' + info.path + '/config',
  });

  for (const file of en_files) {
    const content = fs.readFileSync(use._root + '/sys/' + info.path + '/config/' + file);

    fs.writeFileSync(use._root + '/config/' + info.key + '.' + file, content);
    console.log('INSTALL CONFIG:', info.key + '.' + file)
  }

  config.set('kernal.system', system);
  console.log('ENABLED:', 'Enabled', info.type, info.name, '(' + info.key + ')');
}

function getDependent(manager, info) {
  const extensions = manager.register();
  const dependent = [];

  for (const name in extensions) {
    const extension = extensions[name];

    if (extension.key === info.key) continue;
    if (extension.dependencies) {
      if (extension.dependencies.indexOf(info.key) !== -1) {
        dependent.push(extension.key);
      }
    }
  }
  return dependent;
}

function disable(system, config, manager, info) {
  console.log('TRY DISABLE:', info.type, info.name, '(' + info.key + ')');
  const result = getDependent(manager, info);

  if (result.length) {
    console.error('DEPENDENT: Extension is dependent by', result.join(', '));
    return false;
  }

  doDisable(system, config, info);

  return true;
}

function doDisable(system, config, info) {
  const index = system[info.type].indexOf(info.key);
  system[info.type].splice(index, 1);

  console.log('DISABLE EXTENSION:', info.type, info.name, '(' + info.key + ')');

  const dis_files = glob.sync(info.key + '.*.json', {
    cwd: use._root + '/config',
  });

  for (const file of dis_files) {
    fs.unlinkSync(use._root + '/config/' + file);
    console.log('REMOVE CONFIG:', file);
  }

  config.set('kernal.system', system);
}
