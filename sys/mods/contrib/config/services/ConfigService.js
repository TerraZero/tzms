const ConfigFactory = use(':config/annotations/ConfigFactory');

module.exports = class ConfigService {

  constructor() {
    this._register = null;
    this._config = sys.get('core/Config');
  }

  register() {
    if (this._register === null) {
      this._register = {};
      const extensions = sys.get('core/ExtensionManager');
      const factories = sys.getByDefinition(ConfigFactory);

      for (const factory of factories) {
        const annotation = factory.annotations.shift();

        this._register[annotation.value] = {
          namespace: extensions.getNamespace(annotation.filePath),
          id: annotation.value,
        };
      }
    }
    return this._register;
  }

  getFactory(id) {
    const register = this.register();

    if (register[id].factory === undefined) {
      register[id].factory = new (use(register[id].namespace))(this._config, id);
    }
    return register[id].factory;
  }

}
