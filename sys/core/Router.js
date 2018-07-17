const URL = require('url');
const PATH = require('path');
const querystring = require('querystring');
const Pattern = require('url-pattern');

const Controller = use('annotations/Controller');
const ExtensionManager = sys.get('core/ExtensionManager');

module.exports = class Router {

  constructor() {
    this._handlers = [];

    this.init();
  }

  init() {
    for (const controller of sys.getByMethod(Controller)) {
      for (const annotation of controller.annotations) {
        this.register(annotation.value, annotation.filePath, annotation.target);
      }
    }
  }

  register(pattern, controller, method) {
    this._handlers.push({
      pattern: new Pattern(pattern, {
        segmentNameCharset: 'a-zA-Z0-9.',
        segmentValueCharset: 'a-zA-Z0-9-_~ %.',
      }),
      controller,
      method,
      name: PATH.basename(controller).slice(0, -PATH.extname(controller).length),
      namespace: ExtensionManager.getNamespace(controller),
    });
    return this;
  }

  route(url) {
    for (const handler of this._handlers) {
      const routed = {
        url: url,
        parse: URL.parse(url),
      };

      if (typeof routed.parse.query === 'string') {
        routed.parse.query = querystring.parse(routed.parse.query);
      }

      routed.params = handler.pattern.match(routed.parse.pathname);

      if (routed.params !== null) {
        routed.handler = handler;
        return routed;
      }
    }
    return null;
  }

  url(controller, method, data = {}) {
    for (const handler of this._handlers) {
      if (handler.namespace === controller && handler.method === method) {
        return handler.pattern.stringify(data);
      }
    }
    return null;
  }

}
