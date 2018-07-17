const PATH = require('path');

module.exports = class ExtensionManager {

  constructor() {
    this._extensions = sys.get('core/Config').get('extensions');
    this._system = sys.get('core/Config').get('kernal.system', {
      theme: [],
      module: [],
    });

    this._register = null;
    this._modules = null;
    this._themes = null;
  }

  getInfo(extension) {
    if (this._extensions.theme[extension] !== undefined) {
      const info = this._extensions.theme[extension];

      if (this._system.theme.indexOf(extension) !== -1) {
        info.enabled = true;
      } else {
        info.enabled = false;
      }
      return info;
    }
    if (this._extensions.module[extension] !== undefined) {
      const info = this._extensions.module[extension];

      if (this._system.module.indexOf(extension) !== -1) {
        info.enabled = true;
      } else {
        info.enabled = false;
      }
      return info;
    }
    return null;
  }

  register() {
    if (this._register !== null) return this._register;
    this._register = {};

    for (const name in this._extensions.theme) {
      const theme = this._extensions.theme[name];

      if (this._system.theme.indexOf(theme.key) !== -1) {
        this._register[theme.key] = theme;
      }
    }

    for (const name in this._extensions.module) {
      const module = this._extensions.module[name];

      if (this._system.module.indexOf(module.key) !== -1) {
        this._register[module.key] = module;
      }
    }
    return this._register;
  }

  getModules() {
    if (this._modules === null) {
      const register = this.register();

      this._modules = [];
      for (const name in register) {
        const extension = register[name];

        if (extension.type === 'module') {
          this._modules.push(extension);
        }
      }
    }
    return this._modules;
  }

  getThemes() {
    if (this._themes === null) {
      const register = this.register();

      this._themes = [];
      for (const name in register) {
        const extension = register[name];

        if (extension.type === 'theme') {
          this._themes.push(extension);
        }
      }
    }
    return this._themes;
  }

  getPath(extension) {
    return use._root + '/sys/' + extension.path;
  }

  getNamespace(path) {
    const register = this.register();

    for (const name in register) {
      const extension = register[name];
      const ext = this.getPath(extension);

      if (path.startsWith(ext)) {
        return ':' + extension.key + '/' + path.slice(ext.length + 1, -PATH.extname(path).length);
      }
    }
    if (path.startsWith(use._root + '/sys/')) {
      return path.slice((use._root + '/sys/').length + 1, -PATH.extname(path).length)
    }
    return null;
  }

}
