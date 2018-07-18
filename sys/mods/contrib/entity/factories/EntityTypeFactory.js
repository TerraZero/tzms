const ConfigFactory = use(':config/base/ConfigFactory');

/**
 * @ConfigFactory('entity_type')
 */
module.exports = class EntityTypeFactory extends ConfigFactory {

  create(key) {
    return {
      key: key,
      name: '',
      fields: [],
    }
  }
}
