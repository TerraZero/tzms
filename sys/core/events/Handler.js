module.exports = class Handler {

  constructor() {
    this._register = {};
    this._cache = {};
  }

  on(event, cb) {
    if (this._register[event] === undefined) {
      this._register[event] = [];
    }
    this._register[event].push(cb);
    return this;
  }

  getListeners(event) {
    if (this._cache[event] !== undefined) return this._cache[event];
    this._cache[event] = [];
    const value = [];

    for (const name of event.split('.')) {
      value.push(name);
      if (this._register[value.join('.')]) {
        for (const listener of this._register[value.join('.')]) {
          this._cache[event].push(listener);
        }
      }
    }
    return this._cache[event];
  }

  trigger(event, args = {}) {
    const listeners = this.getListeners(event);
    const promises = [];

    for (const listener of listeners) {
      promises.push(new Promise(function (resolve, reject) {
        listener(resolve, args, event);
      }))
    }

    return Promise.all(promises).then(function () {
      return args;
    });
  }

}
