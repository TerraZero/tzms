const URL = use('core/URL');
const Controller = use('controllers/Controller');

module.exports = class NodeController extends Controller {

  /**
    * @Controller('/node/:id')
    */
  node(resolve, params) {
    const database = sys.get('core/Database');

    database.connection().where('id', params.id).get('node', (err, response) => {
      if (!response.length) {
        this.redirect(new URL('controllers/ErrorController', 'notFound'));
        resolve();
        return;
      }

      const items = [];

      items.push({
        key: 'ID',
        value: response[0].id,
      });
      items.push({
        key: 'Bundle',
        value: response[0].bundle,
      });
      items.push({
        key: 'Title',
        value: response[0].title,
      });
      items.push({
        key: 'User',
        value: response[0].user,
      });

      this.write('header', '<h1>' + response[0].title + '</h1>');

      this.write('content', {
        theme: 'node.news.full',
        list: items,
      });
      resolve();
    });
  }

  /**
    * @Controller('/node/:id/edit')
    */
  node_edit(resolve, params) {
    this.write('content', 'Node edit: ' + params.id);
    resolve();
  }

  /**
   * @Controller('/form/test')
   */
  formTest(resolve, params) {
    const builder = sys.get(':form/base/FormBuilder');
    const form = builder.get(this, 'form.test');

    this.write('content', form);

    resolve();
  }

}
