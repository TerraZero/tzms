const QueryBuilder = require('node-querybuilder');

module.exports = class Database {

  constructor() {
    this._connection = QueryBuilder.QueryBuilder(sys.config('database'), 'mysql');
  }

  connection() {
    return this._connection;
  }

}
