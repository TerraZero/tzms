const Wetland = require('wetland').Wetland;
const wetland = new Wetland({
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

class User {

  static setMapping(mapping) {
    mapping.forProperty('id').primary().increments();
    mapping.field('username', { type: 'string' });
    mapping.field('name', { type: 'string' });
  }

}

class Node {

  static setMapping(mapping) {
    mapping.forProperty('id').primary().increments();
    mapping.field('title', { type: 'string' });
    mapping.oneToOne('user', { targetEntity: User });
  }

}

wetland.registerEntity(User);
wetland.registerEntity(Node);
wetland.getMigrator().devMigrations()
  .then(() => {
    console.log('ok');
    wetland.destroyConnections();
    return null;
  }).catch((e) => {
    console.log(e);
    wetland.destroyConnections();
    return null;
  });
