const FormField = use(':form/base/FormField');

module.exports = class Hidden extends FormField {

  constructor(name) {
    super(name);
    this._data.theme = 'form.field.hidden';
    this._data.type = 'hidden';
  }

}
