import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import CurrentMixin from "./CurrentMixin.js";
import DisabledMixin from "./DisabledMixin.js";
import { defaultState, template } from "./internal.js";
import SelectableMixin from "./SelectableMixin.js";

/**
 * An option in a set of choices
 *
 * This is designed for use inside single-select components like
 * [DropdownList](DropdownList) that want to distinguish between an option being
 * the current item (the one the user is navigating with the keyboard, say) and
 * being the selected item (the one chosen by the user as the desired value for
 * a field).
 *
 * @inherits ReactiveElement
 * @mixes CurrentMixin
 * @mixes DisabledMixin
 * @mixes SelectableMixin
 */
class Option extends AriaRoleMixin(
  CurrentMixin(DisabledMixin(SelectableMixin(ReactiveElement)))
) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      role: "option",
    });
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }
}

export default Option;
