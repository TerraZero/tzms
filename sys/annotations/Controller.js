'use strict';

const Annotation = use('core/annotation/Annotation');

module.exports = class Controller extends Annotation {

  static get targets() { return [this.METHOD] }

  fields() {
    return {
      value: null,
    };
  }

}
