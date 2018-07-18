module.exports = class FormState {

  constructor(fields) {
    this._fields = fields || {};
  }

  getValue(field) {
    return this.get(field.name());
  }

  get(name) {
    if (this._fields[name]) {
      return this._fields[name];
    }
    return undefined;
  }

  set(name, value) {
    this._fields[name] = value;
    return this;
  }

}
