const formidable = require('formidable');
const FormState = use(':form/base/FormState');
const builder = sys.get(':form/base/FormBuilder');

module.exports = class FormControllerPrepare {

  /**
   * @Listener
   */
  register(events) {
    events.on('controller.prepare', this.onPrepare);
  }

  onPrepare(resolve, data) {
    var form = new formidable.IncomingForm();

    form.parse(data.controller.req(), (err, fields, files) => {
      if (fields.form_id) {
        const forms = data.controller.data('forms') || {};
        const state = new FormState(fields);
        const form = builder.get(data.controller, fields.form_id, state);

        forms[fields.form_id] = {
          state,
          form,
        };

        form.doSubmit(state);

        data.controller.data('forms', forms);
      }
      resolve();
    });
  }

}
