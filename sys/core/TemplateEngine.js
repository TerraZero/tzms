const glob = require('glob');
const pug = require('pug');
const sass = require('dart-sass');
const fs = require('fs');
const extensions = sys.get('core/ExtensionManager');

module.exports = class TemplateEngine {

  constructor() {
    this._themes = extensions.getThemes();
    this._modules = extensions.getModules();
  }

  register() {
    const register = {};

    for (const theme of this._themes) {
      console.log();
      console.log('REGISTER: theme', theme.key);
      const items = {
        templates: {},
        styles: {},
      };

      for (const module of this._modules) {
        this.scan(items, module);
      }

      this.scanTheme(items, theme);
      register[theme.key] = items;
    }
    return register;
  }

  scanTheme(items, theme) {
    if (theme.extends !== undefined) {
      console.log('EXTEND: theme', theme.key, 'with', theme.extends);
      this.scanTheme(items, extensions.getInfo(theme.extends));
    }
    this.scan(items, theme);
  }

  scan(items, extension) {
    console.log('SCAN:', extension.type, extension.key, 'in', extension.path);

    const template_files = glob.sync('**/*.pug', {
      cwd: extensions.getPath(extension) + '/components',
    });

    for (const template_file of template_files) {
      const item = this.getTemplateItem(template_file, extension);

      items.templates[item.name] = item;
    }

    const style_files = glob.sync('**/*.sass', {
      cwd: extensions.getPath(extension) + '/components',
    });

    for (const style_file of style_files) {
      const item = this.getStyleItem(style_file, extension);

      items.styles[item.name] = item;
    }
  }

  clear() {
    console.log('CLEAR...');
    const templates = sys.config('paths.templates');

    for (const theme of fs.readdirSync(templates)) {
      console.log('CLEAR:', 'theme', theme);
      for (const file of fs.readdirSync(templates + '/' + theme)) {
        fs.unlinkSync(templates + '/' + theme + '/' + file);
      }
      fs.rmdirSync(templates + '/' + theme);
    }

    const styles = sys.config('paths.styles');

    for (const theme of fs.readdirSync(styles)) {
      console.log('CLEAR:', 'theme', theme);
      for (const file of fs.readdirSync(styles + '/' + theme)) {
        fs.unlinkSync(styles + '/' + theme + '/' + file);
      }
      fs.rmdirSync(styles + '/' + theme);
    }
  }

  compile() {
    const register = this.register();
    const tmp = sys.config('paths.tmp') + '/compile';

    console.log();
    console.log('COMPILE...');

    fs.mkdirSync(tmp);
    this.compileTemplates(register);
    this.compileStyles(register);
    fs.rmdirSync(tmp);
  }

  compileTemplates(register) {
    console.log('COMPILE TEMPLATES...');
    const tmp = sys.config('paths.tmp') + '/compile/';
    const target = sys.config('paths.templates');

    for (const theme in register) {
      console.log();
      console.log('PREPARE TEMPLATES:', 'theme', theme);
      const items = register[theme];

      fs.mkdirSync(target + '/' + theme);
      for (const index in items.templates) {
        const item = items.templates[index];
        const source = fs.readFileSync(extensions.getPath(item.extension) + '/components/' + item.path);

        fs.writeFileSync(tmp + item.name + '.pug', source);
      }

      console.log('COMPILE TEMPLATES:', 'theme', theme);
      for (const index in items.templates) {
        const item = items.templates[index];
        const source = fs.readFileSync(tmp + item.name + '.pug');

        const func = pug.compileClient(source, {
          basedir: use._root + '/' + tmp,
        }) + '\nmodule.exports = template;';

        fs.writeFileSync(target + '/' + theme + '/' + item.name + '.js', func);
      }

      console.log('CLEANUP TEMPLATES:', 'theme', theme);
      for (const index in items.templates) {
        const item = items.templates[index];

        fs.unlinkSync(tmp + item.name + '.pug');
      }
    }
  }

  compileStyles(register) {
    console.log('COMPILE STYLES...');
    const tmp = sys.config('paths.tmp') + '/compile/';
    const target = sys.config('paths.styles');

    for (const theme in register) {
      console.log();
      console.log('PREPARE STYLES:', 'theme', theme);
      const items = register[theme];

      fs.mkdirSync(target + '/' + theme);
      for (const index in items.styles) {
        const item = items.styles[index];
        const source = fs.readFileSync(extensions.getPath(item.extension) + '/components/' + item.path);

        fs.writeFileSync(tmp + item.name + '.sass', source);
      }

      console.log('COMPILE STYLES:', 'theme', theme);
      for (const index in items.styles) {
        const item = items.styles[index];
        const source = fs.readFileSync(tmp + item.name + '.sass');

        const css = sass.renderSync({
          data: source.toString(),
          indentedSyntax: true,
        });

        fs.writeFileSync(target + '/' + theme + '/' + item.name + '.css', css.css);
      }

      console.log('CLEANUP STYLES:', 'theme', theme);
      for (const index in items.styles) {
        const item = items.styles[index];

        fs.unlinkSync(tmp + item.name + '.sass');
      }
    }
  }

  getTemplateItem(path, extension) {
    return {
      extension: extension,
      path: path,
      name: path
        .slice(0, -4)
        .replace(/\//g, '.'),
    };
  }

  getStyleItem(path, extension) {
    return {
      extension: extension,
      path: path,
      name: path
        .slice(0, -5)
        .replace(/\//g, '.'),
    };
  }

}
