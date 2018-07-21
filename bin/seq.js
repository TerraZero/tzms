const ORM = require('sequelize');

const orm = new ORM('tzms', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
});

const User = orm.define('user', {
  username: ORM.STRING,
  firstname: ORM.STRING,
  lastname: ORM.STRING,
});

const Node = orm.define('node', {
  title: ORM.STRING,
});

const Field = orm.define('field', {
  delta: ORM.INTEGER,
  value: ORM.STRING,
});

User.hasOne(Node, { as: 'User' });

Node.hasMany(Field, { as: 'Fields' });

/*
orm.sync({
  alter: true,
})
  .then((() => {
    console.log(arguments);
    console.log('Finish');
  }));
//*/

User.create({
  username: 'Admin',
  firstname: 'Admin',
  lastname: 'Admin',
}).then((user) => {
  return Promise.all([
    Node.create({
      title: 'Test Title',
    }),
    Field.create({
      delta: 0,
      value: '1',
    }),
    Field.create({
      delta: 1,
      value: '2',
    }),
  ]).then((node, field1, field2) => {
    console.log(node);
    node.setUser(user);
    node.setField([field1, field2]);
  });
});
