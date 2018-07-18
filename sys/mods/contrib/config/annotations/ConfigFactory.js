'use strict';

const Annotation = use('core/annotation/Annotation');

module.exports = class ConfigFactory extends Annotation {

  static get targets() { return [this.DEFINITION] }

  fields() {
    return {
      value: null,
    };
  }

}
