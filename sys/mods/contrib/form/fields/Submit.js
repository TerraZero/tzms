const FormField = use(':form/base/FormField');

module.exports = class Submit extends FormField {

  constructor(name) {
    super(name);
    this._data.type = 'submit';
  }

}
