#!/usr/bin/env node

const glob = require('glob');
const fs = require('fs');

require('./../boot').then(function () {
  const args = sys.get('core/Command').args(':command/:extension');

  if (args === null) return;

  const config = sys.get('core/Config');
  const manager = sys.get('core/ExtensionManager');

  const system = config.get('kernal.system', {
    theme: [],
    module: [],
  });

  const info = manager.getInfo(args.extension);

  if (info === null) {
    console.error('No extension found with name "' + args.extension + '".');
    console.error('Use "register.js" to register new extensions.');
    return;
  }

  switch (args.command) {
    case 'en':
      if (info.enabled) {
        console.error('Extension "' + args.extension + '" is already enabled.');
        return;
      }

      const result = enable(system, config, manager, info);

      if (result) {
        console.log('SUCCESS:', 'Enabled', info.type, info.name, '(' + info.key + ')');
      } else {
        console.error('FAILED:', 'Enabled', info.type, info.name, '(' + info.key + ')');
      }

      return;
    case 'dis':
      if (!info.enabled) {
        console.error('Extension "' + args.extension + '" is already disabled.');
        return;
      }

      const index = system[info.type].indexOf(info.key);
      system[info.type].splice(index, 1);

      console.log('DISABLE EXTENSION:', info.type, info.name, '(' + info.key + ')');

      const dis_files = glob.sync(info.key + '.*.json', {
        cwd: use._root + '/config',
      });

      for (const file of dis_files) {
        fs.unlinkSync(use._root + '/config/' + file);
        console.log('REMOVE CONFIG:', file)
      }

      config.set('kernal.system', system);
      console.log('SUCCESS:', 'Disabled', info.type, info.name, '(' + info.key + ')');

      return;
    case 'info':
      console.log(JSON.stringify(info, null, '  '));
      return;

    default:
      console.error('Unknown command! Allowed values: (en|dis|info).');
      return;
  }

});

function getDependencies(system, manager, info, order, map) {
  if (info.enabled) return true;

  if (info.dependencies) {
    for (const dependencie of info.dependencies) {
      const dependencie_info = manager.getInfo(dependencie);

      if (dependencie_info === null) {
        console.error('No extension found with name "' + dependencie + '" for dependencie of "' + info.key + '".');
        console.error('Use "register.js" to register new extensions.');
        return false;
      }
      const result = getDependencies(system, manager, dependencie_info, order, map);

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
  const order = [];
  const map = {};
  const result = getDependencies(system, manager, info, order, map);

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

function disable() {

}

function doDisable() {

}
