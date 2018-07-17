module.exports = class FormState {

  constructor(fields) {
    this._fields = fields || null;
  }

  getValue(field) {
    return this.get(field.name());
  }

  get(name) {
    if (this._fields === null) return undefined;

    if (this._fields[name]) {
      return this._fields[name];
    }
    return undefined;
  }

}
