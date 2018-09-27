import * as symbols from './symbols.js';
import * as template from './template.js';


const roleSuffix = 'Role';

/** @type {any} */
const renderedRolesKey = Symbol('renderedRoles');


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

    [symbols.renderNodeWithRole](node, role) {
      if (node[symbols.role] !== role) {
        const replacement = template.createElement(role);
        template.replace(node, replacement);
        replacement[symbols.role] = role;
        if (replacement.id) {
          this.$[replacement.id] = replacement;
        }
      }
    }

  }

}
