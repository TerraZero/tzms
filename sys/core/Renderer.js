const fs = require('fs');

module.exports = class Renderer {

  constructor(controller) {
    this._controller = controller;
    this._theme = null;

    this.setTheme(controller.getTheme());
    this._paths = {
      templates: sys.config('paths.templates'),
      styles: sys.config('paths.styles'),
    };
  }

  setTheme(theme = null) {
    if (theme === null) {
      this._theme = sys.get('core/Config').get('kernal.themes').active;
    } else {
      this._theme = theme;
    }
  }

  render(vars) {
    if (Array.isArray(vars)) {
      const data = [];
      for (const item of vars) {
        data.push(this.render(item));
      }
      return data.join('');
    }

    switch (typeof vars) {
      case 'string':
        return vars;
      case 'object':
        if (typeof vars.render === 'function') {
          return this.render(vars.render());
        }

        if (vars.theme === undefined) return '';

        const template = this.getTempalte(vars.theme);

        vars.render = this.render.bind(this);
        return template(vars);
    }
  }

  getTempalte(name) {
    this.addStyles(name);
    return require(use._root + '/' + this._paths.templates + '/' + this._theme + '/' + name);
  }

  addStyles(name) {
    if (fs.existsSync(use._root + '/' + this._paths.styles + '/' + this._theme + '/' + name + '.css')) {
      this._controller.meta('styles', {
        theme: 'meta.style',
        href: '/files/styles/' + this._theme + '/' + name + '.css',
      });
    }
  }

}
