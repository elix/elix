import * as internal from "./internal.js";
import Button from "./Button.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SlotContentMixin from "./SlotContentMixin.js";

const Base = FocusVisibleMixin(
  LanguageDirectionMixin(SlotContentMixin(Button))
);

/**
 * Generic tab button with a text label
 *
 * This component is used by [Tabs](Tabs), which by default will generate an
 * instance of `TabButton` for each panel in a set of tab panels.
 *
 * @inherits WrappedStandardElement
 * @mixes FocusVisibleMixin
 * @mixes LanguageDirectionMixin
 * @mixes SlotContentMixin
 */
class TabButton extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      selected: false,
      treatEnterAsClick: false, // Let tab strip handle Enter.
      treatSpaceAsClick: false, // Let tab strip handle Space.
      position: "top"
    });
  }

  /**
   * The position of the tab strip with respect to the associated tab panels.
   *
   * Setting this property does not actually change the tab buttons's position
   * in the document, but lets the tab button know how it should display itself.
   * The standard apperance of `TabButton` is to hide the visible border between
   * the tab button and its associated panel, and `position` is used to
   * determine which edge's border should be hidden.
   *
   * @type {('bottom'|'left'|'right'|'top')}
   * @default 'top'
   */
  get position() {
    return this[internal.state].position;
  }
  set position(position) {
    this[internal.setState]({ position });
  }

  get selected() {
    return this[internal.state].selected;
  }
  set selected(selected) {
    this[internal.setState]({ selected });
  }
}

export default TabButton;
