import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Lets a component define its ARIA role through a `role` state member
 *
 * Among other things, this allows a class or mixin to define a default
 * role through the component's `defaultState`.
 *
 * Some mixins come with identicial support for managing an ARIA role. Those
 * mixins include [AriaListMixin](AriaListMixin),
 * [AriaMenuMixin](AriaMenuMixin), [DialogModalityMixin](DialogModalityMixin),
 * and [PopupModalityMixin](PopupModalityMixin). If you're using one of those
 * mixins, you do *not* need to use this mixin.
 *
 * @module AriaRoleMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function AriaRoleMixin(Base) {
  // The class prototype added by the mixin.
  class AriaRole extends Base {
    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.role) {
        // Apply top-level role.
        const { role } = this[internal.state];
        this.setAttribute("role", role);
      }
    }

    // Setting the standard role attribute will invoke this property setter,
    // which will allow us to update our state.
    get role() {
      return super.role;
    }
    set role(role) {
      super.role = role;
      if (!this[internal.rendering]) {
        this[internal.setState]({ role });
      }
    }
  }

  return AriaRole;
}
