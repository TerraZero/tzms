const Form = use(':form/base/Form');
const Textfield = use(':form/fields/Textfield');
const Submit = use(':form/fields/Submit');
const FieldCollection = use(':form/base/FormFieldCollection');
const URL = use('core/URL');

/**
 * @Form('form.test')
 */
module.exports = class TestForm extends Form {

  id() {
    return 'form.test';
  }

  build(state) {
    this.action(new URL(':user/controllers/NodeController', 'formTest').getURL());
    this.method('post');

    this.addField(new Textfield('cool'));
    this.addField(new FieldCollection('huhu', this.multi.bind(this)));
    this.addField(new Submit('kk').value('cool'));
    this.addField(new Submit('submit').value('prepare'));
  }

  multi(collection, index) {
    collection.addField(index, new Textfield('hallo').label('Hallo ' + index));
    collection.addField(index, new Textfield('guck').label('Guck ' + index));
    collection.addField(index, new FieldCollection('part', this.part.bind(this)));
  }

  part(collection, index) {
    collection.addField(index, new Textfield('partie').label('Partie ' + index));
  }

}
