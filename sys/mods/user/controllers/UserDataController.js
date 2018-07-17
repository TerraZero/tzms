const Controller = use('controllers/JsonController');

module.exports = class UserDataController extends Controller {

  /**
    * @Controller('/data/user/:id')
    */
  user(params) {
    this.res().write(JSON.stringify({
      name: 'user',
      id: params.id,
    }));
  }

}
