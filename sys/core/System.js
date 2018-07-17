const glob = require('glob');
const PATH = require('path');

const AnnotationParser = require('./annotation/AnnotationParser');
const Annotation = require('./annotation/Annotation');

module.exports = class System {

  constructor(config, root) {
    this._config = config;
    this._files = [];
    this._emitter = null;
    this._getcache = {};
    this._root = root;
  }

  config(key, fallback) {
    let value = this._config;
    for (const k of key.split('.')) {
      if (value[k] === undefined) return fallback;
      value = value[k];
    }
    return value;
  }

  init() {
    const extensions = this.get('core/ExtensionManager');
    const modules = extensions.getModules();

    const core_annotations = glob.sync('annotations/**/*.js', {
      cwd: use._root + '/sys/',
    });

    for (const core_annotation of core_annotations) {
      AnnotationParser.register(use._root + '/sys/' + core_annotation);
    }

    for (const module of modules) {
      const annotations = glob.sync('annotations/**/*.js', {
        cwd: extensions.getPath(module),
      });

      for (const annotation of annotations) {
        AnnotationParser.register(extensions.getPath(module) + '/' + annotation);
      }
    }

    for (const module of modules) {
      const files = glob.sync('**/*.js', {
        cwd: extensions.getPath(module),
      });

      for (const file of files) {
        this.register(':' + module.key + '/' + file);
      }
    }

    const Handler = use('core/events/Handler');
    this._handler = new Handler();
    const Listener = require('../annotations/Listener');

    const listeners = this.getByMethod(Listener);

    for (const listener of listeners) {
      for (const annotation of listener.annotations) {
        const namespace = extensions.getNamespace(annotation.filePath);
        const object = this.get(namespace);

        object[annotation.target].call(object, this._handler);
      }
    }

    return this.trigger('system.init', {
      system: this,
    });
  }

  register(namespace) {
    const path = this.resolve(namespace);

    this._files.push({
      parser: new AnnotationParser(this._root + '/sys/' + path),
      name: PATH.basename(path).slice(0, -PATH.extname(path).length),
      namespace: namespace,
    });
  }

  getByDefinition(annotation) {
    return this.getByAnnotation(annotation, Annotation.DEFINITION);
  }

  getByMethod(annotation) {
    return this.getByAnnotation(annotation, Annotation.METHOD);
  }

  getByAnnotation(annotation, type = Annotation.DEFINITION) {
    const data = [];

    for (const file of this._files) {
      const annotations = file.parser.get(type, annotation);

      if (annotations) {
        data.push({
          parser: file.parser,
          annotations,
        });
      }
    }
    return data;
  }

  trigger(event, data = {}) {
    return this._handler.trigger(event, data);
  }

  resolve(path) {
    if (path.startsWith(':')) {
      const parts = path.split('/');

      const extensions = this.get('core/ExtensionManager');
      const mod = parts.shift().substring(1);
      const info = extensions.getInfo(mod);
      if (info === null || !info.enabled) {
        throw new Error('The module "' + mod + '" is not enabled or not found.');
      }
      return info.path + '/' + parts.join('/');
    }
    return path;
  }

  use(path) {
    path = this.resolve(path);
    const struct = require(this._root + '/sys/' + path);

    struct.__namespace = path;
    return struct;
  }

  get(path) {
    let struckt = null;

    if (typeof path === 'function') {
      struckt = path;
      path = path.__namespace;
    }

    if (this._getcache[path] === undefined) {
      if (struckt === null) {
        struckt = use(path);
      }

      if (typeof struckt.factory === 'function') {
        this._getcache[path] = struckt.factory(this);
      } else {
        this._getcache[path] = new struckt();
      }
    }
    return this._getcache[path];
  }

}
