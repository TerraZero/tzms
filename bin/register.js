#!/usr/bin/env node

require('./../boot').then(function () {
  const PATH = require('path');
  const glob = require('glob');
  const config = sys.get('core/Config');

  const extensions = {
    module: {},
    theme: {},
    files: {},
  };

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
  }

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
  }

  config.set('extensions', extensions);
});
