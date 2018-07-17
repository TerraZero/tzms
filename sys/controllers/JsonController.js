const DefaultController = use('controllers/DefaultController');

module.exports = class JsonController extends DefaultController {

  prepare() {
    this.addHeader('Content-Type', 'application/json');
    return super.prepare();
  }

}
