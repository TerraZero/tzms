module.exports = class KernalEvents {

  /**
   * @Listener
   */
  register(handler) {
    handler.on('system.router.notFound', this.urlNotFound.bind(this));
  }


  urlNotFound(resolve, data) {
    data.Controller = use(':kernal/controllers/ErrorController');
    data.method = 'toError';
    data.params.error = 'notFound';
    resolve();
  }

}
