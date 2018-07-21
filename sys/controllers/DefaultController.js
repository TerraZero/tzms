module.exports = class Controller {

  constructor(data) {
    this._data = data;
    this._data.data = {};

    this._executes = {
      loader: [],
      content: [],
    };

    this._build = {
      code: 200,
      header: {},
      body: {},
      redirect: null,
      theme: null,
      meta: {},
    };
  }

  _meta() {
    return this._build.meta;
  }

  _prepare() {
    return sys.trigger('controller.prepare', {
      controller: this,
    });
  }

  _doResponse() {
    if (this.isRedirect()) {
      this.res().writeHead(this._build.code, {
        'Location': this._build.redirect.getURL(),
      });
      this.res().end();
      return;
    }

    this.res().writeHead(this._build.code, this._build.header);

    this.res().write(this._doRender());

    this.res().end();
  }

  _doRender() {
    const Renderer = use('core/Renderer');
    const renderer = new Renderer(this);

    return renderer.render(this);
  }

  _execute(data) {
    this._prepare()
      .then(() => {
        if (this.isRedirect()) {
          this._doResponse();
        } else {
          return Promise.resolve()
            .then(() => { return this._doExecute(data); })
            .then(() => { return this._doLoader() })
            .then(() => { return this._doContent() })
            .then(this._doResponse.bind(this));
        }
      });
  }

  _doExecute(data) {
    return new Promise((resolve, reject) => {
      this[data.method].call(this, resolve, data.params, reject);
    });
  }

  _doLoader() {
    const promises = [];

    for (const loader of this._executes.loader) {
      promises.push(new Promise((resolve, reject) => {
        loader(resolve, reject);
      }));
    }
    return Promise.all(promises);
  }

  _doContent() {
    const promises = [];

    for (const content of this._executes.content) {
      promises.push(new Promise((resolve, reject) => {
        content(resolve, reject);
      }));
    }
    return Promise.all(promises);
  }

  render() {
    this._build.body.theme = 'page';

    return {
      theme: 'html',
      title: this.constructor.name,
      body: this._build.body,
      meta: this._meta.bind(this),
    };
  }

  req() {
    return this._data.request;
  }

  res() {
    return this._data.response;
  }

  routed() {
    return this._data.routed;
  }

  setCookie(name, value) {
    this._data.cookies.set(name, value);
    return this;
  }

  getCookie(name) {
    return this._data.cookies.get(name);
  }

  data(name, value) {
    if (name === undefined) {
      return this._data.data;
    }

    if (value === undefined) {
      return this._data.data[name] || null;
    } else {
      this._data.data[name] = value;
      return this;
    }
  }

  write(region, data) {
    if (this._build.body[region] === undefined) {
      this._build.body[region] = [];
    }
    this._build.body[region].push(data);
  }

  meta(type, data) {
    if (this._build.meta[type] === undefined) {
      this._build.meta[type] = [];
    }
    this._build.meta[type].push(data);
  }

  redirect(url, code = 302) {
    this._build.redirect = url;
    this.setCode(code);
  }

  setTheme(theme = null) {
    this._build.theme = theme;
  }

  getTheme() {
    return this._build.theme;
  }

  isRedirect() {
    return this._build.redirect !== null;
  }

  setCode(code = 200) {
    this._build.code = code;
  }

  addHeader(key, value) {
    this._build.header[key] = value;
  }

  loader(func) {
    this._executes.loader.push(func);
    return this;
  }

  content(func) {
    this._executes.content.push(func);
    return this;
  }

}
