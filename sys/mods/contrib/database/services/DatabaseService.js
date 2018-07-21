const glob = require('glob');
const Wetland = require('wetland').Wetland;

module.exports = class DatabaseService {

  constructor() {
    this._orm = null;

    this.init();
    this.schema = this.registerSchemas();
  }

  orm() {
    return this._orm;
  }

  registerSchemas() {
    const schemas = {};
    const extensions = sys.get('core/ExtensionManager');
    const mods = extensions.getModules();

    for (const mod of mods) {
      const files = glob.sync('schemas/**/*.js', {
        cwd: use._root + '/sys/' + mod.path,
      });

      for (const file of files) {
        const schema = require(use._root + '/sys/' + mod.path + '/' + file)(schemas);

        schemas[schema.name] = schema;
      }
    }

    const orm = this.orm();

    for (const schema in schemas) {
      orm.registerEntity(schemas[schema]);
    }

    return schemas;
  }

  init() {
    this._orm = new Wetland({
      stores: {
        defaultStore: {
          client: 'mysql2',
          connection: {
            host: 'localhost',
            user: 'root',
            database: 'wetland',
          }
        }
      },
    });
  }

  updateSchema() {
    return this.orm()
      .getMigrator()
      .devMigrations();
  }

  getRepository(entity) {
    return this.orm().getManager().getRepository(entity);
  }

}
