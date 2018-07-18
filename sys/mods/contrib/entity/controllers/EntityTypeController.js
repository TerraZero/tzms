const URL = use('core/URL');
const Controller = use('controllers/Controller');
const FormState = use(':form/base/FormState');

module.exports = class EntityTypeController extends Controller {

  /**
    * @Controller('/entity-type/list')
    */
  listEntityType(resolve, params) {
    const factory = sys.get(':config/services/ConfigService').getFactory('entity_type');
    const index = factory.index();
    const build = [];

    build.push({
      theme: 'links.link',
      url: new URL(':entity/controllers/EntityTypeController', 'newEntityType'),
      text: '+ new Entity Type',
    });
    for (const name of index) {
      const info = factory.load(name);

      build.push({
        theme: 'links.link',
        url: new URL(':entity/controllers/EntityTypeController', 'editEntityType', {
          key: info.key,
        }),
        text: 'Edit ' + info.name,
      });
    }

    this.write('content', build);

    resolve();
  }

  /**
    * @Controller('/entity-type/new')
    */
  newEntityType(resolve, params) {
    const builder = sys.get(':form/base/FormBuilder');
    const form = builder.get(this, 'entity_type.form', new FormState({
      mode: 'new',
    }));

    this.write('content', form);

    resolve();
  }

  /**
    * @Controller('/entity-type/edit/:key')
    */
  editEntityType(resolve, params) {
    const builder = sys.get(':form/base/FormBuilder');
    const form = builder.get(this, 'entity_type.form', new FormState({
      key: params.key,
      mode: 'edit',
    }));

    this.write('content', form);

    resolve();
  }

}
