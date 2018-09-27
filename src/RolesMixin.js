import * as symbols from './symbols.js';
import * as template from './template.js';


export default function RolesMixin(Base) {

  return class Roles extends Base {

    constructor() {
      super();
      this[symbols.renderedRoles] = {};
    }

    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
      this[symbols.renderRoles]();
    }

    [symbols.renderRoles]() {
      if (super[symbols.renderRoles]) { super[symbols.renderRoles](); }
    }

  }

}
