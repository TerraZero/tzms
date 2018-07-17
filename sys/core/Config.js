const fs = require('fs');

module.exports = class Config {

  get(name, flush = false) {
    const path = use._root + '/config/' + name + '.json';

    if (flush) {
      delete require.cache[require.resolve(path)]
    }
    return require(path);
  }

  set(name, data = {}) {
    const path = use._root + '/config/' + name + '.json';

    fs.writeFileSync(path, JSON.stringify(data, null, '  '));
    delete require.cache[require.resolve(path)];
  }

  exist(name) {
    const path = use._root + '/config/' + name + '.json';

    return fs.existsSync(path);
  }

  getValue(name, key, flush = false) {
    let config = this.get(name, flush);
    const keys = key.split('.');

    for (const index of keys) {
      config = config[index];
    }
    return config;
  }

}
