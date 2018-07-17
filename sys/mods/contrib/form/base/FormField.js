module.exports = class FormField {

  constructor(name) {
    this._data = {
      theme: 'form.field.form-field',
      name: name,
      attr: {},
      errors: [],
    };
    this._validates = [];
  }

  name(name) {
    if (name === undefined) {
      return this._data.name;
    } else {
      this._data.name = name;
      return this;
    }
  }

  addClass(name) {
    if (this._data.attr.class === undefined) {
      this._data.attr.class = [];
    }
    this._data.attr.class.push(name);
    return this;
  }

  removeClass(name) {
    if (this._data.attr.class !== undefined) {
      this._data.attr.class.splice(this._data.attr.class.indexOf(name), 1);
    }
    return this;
  }

  attr(name, value) {
    if (name === undefined) return this._data.attr;
    if (value === undefined) {
      return this._data.attr[name];
    } else {
      this._data.attr[name] = value;
      return this;
    }
  }

  label(label = null) {
    if (label !== null) {
      this._data.label = label;
      return this;
    } else {
      return this._data.label || null;
    }
  }

  value(value) {
    if (value !== undefined) {
      this._data.value = value;
      return this;
    } else {
      return this._data.value || this._data.default || null;
    }
  }

  setDefault(value) {
    this._data.default = value;
    return this;
  }

  type() {
    return this._data.type;
  }

  setFieldState(state) {
    this.value(state.getValue(this));
  }

  render() {
    this.addClass('form-field--' + this.type());

    if (this._data.errors.length) {
      this.addClass('form-field--error');
    }

    this._data.val = this.value();
    return this._data;
  }

  setError(message) {
    this._data.errors.push(message);
    return this;
  }

  doValidate(form, state, collection = null) {
    for (const validate of this._validates) {
      validate(form, state, this, collection);
    }
  }

  addValidate(handler) {
    this._validates.push(handler);
    return this;
  }

}
