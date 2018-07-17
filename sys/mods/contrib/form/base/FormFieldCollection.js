const FormField = use(':form/base/FormField');
const Submit = use(':form/fields/Submit');
const Hidden = use(':form/fields/Hidden');

module.exports = class FormFieldCollection extends FormField {

  constructor(name, generator) {
    super(name);
    this._data.theme = 'form.field.field-collection';
    this._data.type = 'collection';
    this._generator = generator;
    this._number = 1;
    this._fields = {};
  }

  addField(index, field) {
    if (this._fields[index] === undefined) this._fields[index] = [];
    field.name(this.name() + '.' + field.name() + '.' + index);
    this._fields[index].push(field);
    return this;
  }

  actions() {
    return [
      new Submit(this.name() + '.addItem').value('Add item'),
      new Submit(this.name() + '.removeItem').value('Remove item'),
      new Hidden(this.name() + '.number').value(this._number),
    ];
  }

  setFieldState(state) {
    this._number = parseInt(state.get(this.name() + '.number')) || 1;

    if (state.get(this.name() + '.addItem')) {
      this._number++;
    }
    if (state.get(this.name() + '.removeItem')) {
      this._number = this._number - 1 || 1;
    }

    for (let i = 0; i < this._number; i++) {
      this._generator(this, i);
    }
    for (const index in this._fields) {
      for (const field of this._fields[index]) {
        field.setFieldState(state);
      }
    }
  }

  fields() {
    return this._fields;
  }

  render() {
    const render = super.render();

    render.actions = this.actions();
    render.fields = this.fields();
    return render;
  }

  doValidate(form, state, collection = null) {
    const fields = this.fields();

    for (const index in fields) {
      for (const field of fields[index]) {
        field.doValidate(form, state, this);
      }
    }
    for (const validate of this._validates) {
      validate(form, state, this, collection);
    }
  }

}
