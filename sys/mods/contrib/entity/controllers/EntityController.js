const URL = use('core/URL');
const Controller = use('controllers/Controller');
const FormState = use(':form/base/FormState');

module.exports = class EntityController extends Controller {

  /**
    * @Controller('/:entity/edit/:id')
    */
  listEntityType(resolve, params) {
    this
      .loader(this.loadNode.bind(this))
      .content(this.showData.bind(this));
    resolve();
  }

  loadNode(resolve, reject, params) {
    const nodeStorage = this.db().getRepository(params.entity);
    const userStorage = this.db().getRepository('User');

    nodeStorage
      .findOne(params.id)
      .then((node) => {
        this.data('node', node);
        userStorage
          .findOne(node.user)
          .then((user) => {
            this.data('user', user);
            resolve();
          });
      });
  }

  showData(resolve, reject, params) {
    const node = this.data('node');
    const user = this.data('user');

    this.write('content', 'node: ' + node.title);
    this.write('content', 'user: ' + user.name);
    resolve();
  }

}
