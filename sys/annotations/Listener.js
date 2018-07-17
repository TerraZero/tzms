'use strict';

const Annotation = use('core/annotation/Annotation');

module.exports = class Listener extends Annotation {

  static get targets() { return [this.METHOD] }

  fields() {
    return {
      value: null,
    };
  }

}
