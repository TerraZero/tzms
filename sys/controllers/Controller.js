const DefaultController = use('controllers/DefaultController');

module.exports = class Controller extends DefaultController {

  prepare() {
    this.addHeader('Content-Type', 'text/html');
    return super.prepare();
  }

}
