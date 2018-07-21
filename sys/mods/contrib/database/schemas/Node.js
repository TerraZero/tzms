module.exports = function (entities) {
  return class Node {

    static setMapping(mapping) {
      mapping.forProperty('id').primary().increments();
      mapping.field('title', { type: 'string' });
      mapping.oneToOne('user', { targetEntity: entities.User });
    }

  };
};
