#!/usr/bin/env node

require('./../boot').then(function () {
  const args = sys.get('core/Command').args(':config/:key/:data');

  if (args === null) return;

  const config = sys.get('core/Config');

  let value = config.get(args.config);
  const keys = args.key.split('.');

  const number = parseInt(args.data);

  let result = null;
  if (number + '' === args.data) {
    result = setValue(value, keys, number);
  } else {
    result = setValue(value, keys, args.data);
  }

  if (result) {
    config.set(args.config, value);
  } else {
    console.error('ERROR: Target value must be a primitive value.');
  }

  function setValue(value, keys, data) {
    const last = keys.pop();

    for (const key of keys) {
      if (value[key] === undefined) return false;
      value = value[key];
    }

    if (typeof value[last] === 'object' || value[last] === undefined) {
      return false;
    }
    value[last] = data;
    return true;
  }
});
