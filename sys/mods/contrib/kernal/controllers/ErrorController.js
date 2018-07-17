const URL = use('core/URL');
const Controller = use('controllers/Controller');

module.exports = class ErrorController extends Controller {

  toError(resolve, params) {
    this.redirect(new URL(':kernal/controllers/ErrorController', params.error), 307);
    resolve();
  }

  /**
   * @Controller('/error/404')
   */
  notFound(resolve, params) {
    this.setCode(404);
    this.write('content', 'Error 404 not found');
    resolve();
  }

  /**
   * @Controller('/error/403')
   */
  notAuthorized(resolve, params) {
    this.setCode(403);
    this.write('content', 'Error 403 not authorized');
    resolve();
  }

}
