#!/usr/bin/env node

require('./../boot').then(function () {
  const args = sys.get('core/Command').args(':config(/:key)');

  if (args === null) return;

  if (args.key) {
    console.log(JSON.stringify(sys.get('core/Config').getValue(args.config, args.key), null, '  '));
  } else {
    console.log(JSON.stringify(sys.get('core/Config').get(args.config), null, '  '));
  }
});
