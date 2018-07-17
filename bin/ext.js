#!/usr/bin/env node

require('./../boot').then(function () {
  const args = sys.get('core/Command').args(':command/:extension');

  if (args === null) return;

  const config = sys.get('core/Config');
  const manager = sys.get('core/ExtensionManager');

  const system = config.get('system');

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

      system[info.type].push(info.key);
      config.set('system', system);

      return;
    case 'dis':
      if (!info.enabled) {
        console.error('Extension "' + args.extension + '" is already disabled.');
        return;
      }

      const index = system[info.type].indexOf(info.key);
      system[info.type].splice(index, 1);
      config.set('system', system);

      return;
    case 'info':
      console.log(JSON.stringify(info, null, '  '));
      return;
    default:
      console.error('Unknown command! Allowed values: (en|dis|info).');
      return;
  }

});
