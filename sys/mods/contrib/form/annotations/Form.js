'use strict';

const Annotation = use('core/annotation/Annotation');

module.exports = class Form extends Annotation {

  static get targets() { return [this.DEFINITION] }

  fields() {
    return {
      value: null,
    };
  }

}
