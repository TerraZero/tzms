module.exports = class Controller {

  constructor(data) {
    this._data = data;
    this._data.data = {};

    this._build = {
      code: 200,
      header: {},
      body: {},
      redirect: null,
      theme: null,
      meta: {},
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

  prepare() {
    return sys.trigger('controller.prepare', {
      controller: this,
    });
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

  doRender() {
    const Renderer = use('core/Renderer');
    const renderer = new Renderer(this);

    return renderer.render(this);
  }

  doResponse() {
    if (this.isRedirect()) {
      this.res().writeHead(this._build.code, {
        'Location': this._build.redirect.getURL(),
      });
      this.res().end();
      return;
    }

    this.res().writeHead(this._build.code, this._build.header);

    this.res().write(this.doRender());

    this.res().end();
  }

  render() {
    this._build.body.theme = 'page';

    return {
      theme: 'html',
      title: this.constructor.name,
      body: this._build.body,
      meta: this.renderMeta.bind(this),
    };
  }

  renderMeta() {
    return this._build.meta;
  }

}
