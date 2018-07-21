module.exports = function (entities) {
  return class User {

    static setMapping(mapping) {
      mapping.forProperty('id').primary().increments();
      mapping.field('username', { type: 'string' });
      mapping.field('name', { type: 'string' });
    }

  };
};
