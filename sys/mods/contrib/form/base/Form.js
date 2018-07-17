const Hidden = use(':form/fields/Hidden');

module.exports = class Form {

  constructor(definition) {
    this._fields = [];
    this._id = definition.id;
    this._error = false;

    this._validates = [];
    this._submits = [];
  }

  id() {
    return this._id;
  }

  doBuild(state) {
    this.build(state);
    this.addField(new Hidden('form_id').value(this.id()));
    this.doFieldStates(state);
  }

  build(state) {

  }

  validate(state) {

  }

  submit(state) {

  }

  doSubmit(state) {
    this.doValidate(state);
    if (!this.isError()) {
      this.submit();
      for (const submit of this._submits) {
        submit(this, state);
      }
    }
  }

  doValidate(state) {
    for (const field of this.fields()) {
      field.doValidate(this, state);
    }
    this.validate(state);
    for (const validate of this._validates) {
      validate(this, state);
    }
  }

  addSubmit(handler) {
    this._submits.push(handler);
    return this;
  }

  addValidate(handler) {
    this._validates.push(handler);
    return this;
  }

  setError(field, message) {
    field.setError(message);
    this._error = true;
  }

  isError() {
    return this._error;
  }

  doFieldStates(state) {
    for (const field of this._fields) {
      field.setFieldState(state);
    }
  }

  addField(field) {
    this._fields.push(field);
    return this;
  }

  fields() {
    return this._fields;
  }

  method(method = null) {
    if (method !== null) {
      this._method = method;
      return this;
    } else {
      return this._method || null;
    }
  }

  action(action = null) {
    if (action !== null) {
      this._action = action;
      return this;
    } else {
      return this._action || null;
    }
  }

  render() {
    return {
      theme: 'form.form',
      fields: this.fields(),
      method: this.method(),
      action: this.action(),
    };
  }

}
