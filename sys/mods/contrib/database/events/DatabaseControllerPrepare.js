const db = sys.get(':database/services/DatabaseService');

module.exports = class DatabaseControllerPrepare {

  /**
   * @Listener
   */
  register(handler) {
    handler.on('controller.prepare', this.onPrepare);
  }

  onPrepare(resolve, data) {
    data.controller.db = function () {
      return db;
    };
    resolve();
  }

}
