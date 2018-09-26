import * as symbols from './symbols.js';
import * as template from './template.js';


const roleSuffix = 'Role';

/** @type {any} */
const renderedRolesKey = Symbol('renderedRoles');


export default function RolesMixin(Base) {

  return class Roles extends Base {

    [symbols.render]() {
      if (super[symbols.render]) { super[symbols.render](); }
      if (!this[renderedRolesKey]) {
        // First render: Calculate the roles for this component by looking for
        // state members that end in the string "Role".
        this[renderedRolesKey] = {};
        Object.keys(this.state).forEach(key => {
          if (key.endsWith(roleSuffix)) {
            this[renderedRolesKey][key] = null;
          }
        })
      }

      // Calculate which roles have changed (or are new).
      const changes = {};
      Object.keys(this[renderedRolesKey]).forEach(role => {
        if (this[renderedRolesKey] !== this.state[role]) {
          changes[role] = this.state[role];
        }
      });

      // Apply those changes
      this[symbols.renderRoles](changes);

      // Update our record of which roles were rendered so we can calculate
      // changes next time.
      Object.assign(this[renderedRolesKey], changes);
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
