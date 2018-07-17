module.exports = class URL {

  constructor(controller, method, data = {}) {
    this._controller = controller;
    this._method = method;
    this._data = data;

    if (typeof this._controller === 'function' && this._controller.__namespace) {
      this._controller = this._controller.__namespace;
    }
  }

  getURL() {
    return sys.get('core/Router').url(this._controller, this._method, this._data);
  }

  render() {
    return this.getURL();
  }

}
