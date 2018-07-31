const Form = use(':form/base/Form');

const Textfield = use(':form/fields/Textfield');
const Hidden = use(':form/fields/Hidden');
const Submit = use(':form/fields/Submit');
const URL = use('core/URL');

/**
 * @Form('entity_type.form')
 */
module.exports = class EntityForm extends Form {

  getFactory() {
    if (this._factory === undefined) {
      const config = sys.get(':config/services/ConfigService');
      this._factory = config.getFactory('entity_type');
    }
    return this._factory;
  }

  build(state) {
    const submit = new Submit('submit');

    this.addField(new Textfield('key').label('Entity Type Key'));
    this.addField(new Textfield('name').label('Entity Type Name'));
    this.addField(submit);

    this.addField(new Hidden('mode'));

    switch (state.get('mode')) {
      case 'new':
        submit.value('Create');
        break;
      case 'edit':
        submit.value('Save');
        this.addField(new Submit('delete').value('Delete'));

        if (!state.get('submit')) {
          const factory = this.getFactory();
          const data = factory.load(state.get('key'));

          for (const field of this.fields()) {
            if (data[field.name()] === undefined) continue;

            state.set(field.name(), data[field.name()]);
          }
        }
        break;
    }
  }

  validate(state) {
    switch (state.get('mode')) {
      case 'new':
        if (this.getFactory().exist(state.get('key'))) {
          this.setError(this.getField('key'), 'The key is already taken.');
        }
        return;
      case 'edit':
        if (!this.getFactory().exist(state.get('key'))) {
          this.setError(this.getField('key'), 'The key does not exist.');
        }
        return;
    }
  }

  submit(state) {
    const factory = this.getFactory();

    if (state.get('delete')) {
      factory.delete(state.get('key'));
      this.redirect(new URL(':entity/controllers/EntityTypeController', 'listEntityType'));
    } else {
      const data = factory.load(state.get('key'));

      for (const field of this.fields()) {
        if (data[field.name()] === undefined) continue;

        data[field.name()] = field.value();
      }
      factory.save(data);

      switch (state.get('mode')) {
        case 'new':
          this.redirect(new URL(':entity/controllers/EntityTypeController', 'editEntityType', {
            key: state.get('key'),
          }));
          return;
        case 'edit':
          this.redirect(new URL(':entity/controllers/EntityTypeController', 'listEntityType'));
          return;
      }
    }
  }

}
