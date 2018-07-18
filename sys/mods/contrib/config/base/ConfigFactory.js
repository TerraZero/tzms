module.exports = class ConfigFactory {

  constructor(config, name) {
    this._config = config;
    this._name = name;
    this._index = null;
  }

  name() {
    return this._name;
  }

  index() {
    if (this._index === null) {
      this._index = this._config.get('config.' + this.name());
    }
    return this._index || [];
  }

  key(value) {
    return value.key;
  }

  exist(key) {
    return this.index().indexOf(key) !== -1;
  }

  save(value) {
    const key = this.key(value);
    const index = this.index();

    if (index.indexOf(key) === -1) {
      index.push(key);
      this._config.set('config.' + this.name(), index);
      this._index = index;
    }
    return this._config.set('config.' + this.name() + '.' + key, value);
  }

  load(key, flush = false) {
    if (this.index().indexOf(key) === -1) {
      return this.create(key);
    }
    return this._config.get('config.' + this.name() + '.' + key, null, flush);
  }

  delete(key) {
    const index = this.index();

    index.splice(index.indexOf(key), 1);
    this._config.set('config.' + this.name(), index);

    this._config.remove('config.' + this.name() + '.' + key);
    return true;
  }

  create(key) {
    return {
      key,
    };
  }

}
