const FormField = use(':form/base/FormField');

module.exports = class Textfield extends FormField {

  constructor(name) {
    super(name);
    this._data.type = 'text';
  }

}
