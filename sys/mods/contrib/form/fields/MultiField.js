const Submit = use(':form/fields/Submit');
const Hidden = use(':form/fields/Hidden');

module.exports = class MultiField {

  constructor(name, generator) {
    this._generator = generator;
    this._number = 1;
    this._name = name;
  }

  actions() {
    return new Submit('actions.' + this._name).value('Add item');
  }

  hidden() {
    return new Hidden('number.' + this._name);
  }

  render() {
    return {
      theme: 'form.field.multi-field',
      generate: this.generate.bind(this),
      actions: this.actions(),
      number: this._number,
      hidden: this.hidden().value(this._number),
    }
  }

  generate(id) {
    return this._generator(this, id);
  }

  setFieldState(state) {
    if (state.get('actions.' + this._name)) {
      this._number = parseInt(state.get('number.' + this._name)) + 1;
    }
  }

}
