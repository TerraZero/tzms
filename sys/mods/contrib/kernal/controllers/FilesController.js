const fs = require('fs');
const DefaultController = use('controllers/DefaultController');

module.exports = class FilesController extends DefaultController {

  /**
   * @Controller('/files/:type/:theme/:file')
   */
  files(resolve, params) {
    if (params.type === 'styles') {
      this.addHeader('Content-Type', 'text/css');

      this.write('data', fs.readFileSync(use._root + '/' + sys.config('paths.styles') + '/' + params.theme + '/' + params.file));
    }
    resolve();
  }

  doRender() {
    return this._build.body.data.join('');
  }

}
