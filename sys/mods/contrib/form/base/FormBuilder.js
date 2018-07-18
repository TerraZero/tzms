const FormState = use(':form/base/FormState');
const FormAnnotation = use(':form/annotations/Form');

module.exports = class FormBuilder {

  constructor() {
    this._register = {};
    this.init();
  }

  init() {
    const extensions = sys.get('core/ExtensionManager');
    const forms = sys.getByDefinition(FormAnnotation);

    for (const form of forms) {
      const annotation = form.annotations.shift();

      this._register[annotation.value] = {
        namespace: extensions.getNamespace(annotation.filePath),
        id: annotation.value,
      };
    }
  }

  get(controller, formID, state = null, rebuild = false) {
    if (this._register[formID] === undefined) {
      throw new Error('No form found with id "' + formID + '"');
    }

    const forms = controller.data('forms') || {};

    if (!rebuild && forms[formID] && forms[formID].form) {
      return forms[formID].form;
    }

    const Form = use(this._register[formID].namespace);
    const form = new Form(this._register[formID], controller);

    if (state === null) {
      state = forms[formID] && forms[formID].state || new FormState();
    }

    form.doBuild(state);

    return form;
  }

}
