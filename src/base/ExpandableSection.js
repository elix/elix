import * as internal from "./internal.js";
import * as template from "../core/template.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import Button from "./Button.js";
import ExpandablePanel from "./ExpandablePanel.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import UpDownToggle from "./UpDownToggle.js";

const Base = AriaRoleMixin(OpenCloseMixin(ReactiveElement));

/**
 * A document section with a header that can be expanded or collapsed
 *
 * @inherits ReactiveElement
 * @mixes AriaRoleMixin
 * @mixes OpenCloseMixin
 * @part {UpDownToggle} toggle - contains the icons or other element which lets the user know they
 * can expand/collapse the panel
 * @part {Button} header - the header that can be clicked/tapped to expand or collapse the panel
 * @part {ExpandablePanel} panel - contains the component's expandable/collapsible content
 */
class ExpandableSection extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      headerPartType: Button,
      panelPartType: ExpandablePanel,
      role: "region",
      togglePartType: UpDownToggle
    });
  }

  /**
   * The class, tag, or template used to create the `header` part - the header
   * region the user can tap/click to expand or collapse the section.
   *
   * @type {PartDescriptor}
   * @default Button
   */
  get headerPartType() {
    return this[internal.state].headerPartType;
  }
  set headerPartType(headerPartType) {
    this[internal.setState]({ headerPartType });
  }

  /**
   * The class, tag, or template used to create the `panel` part - the container
   * for the expandable/collapsible content.
   *
   * @type {PartDescriptor}
   * @default ExpandablePanel
   */
  get panelPartType() {
    return this[internal.state].panelPartType;
  }
  set panelPartType(panelPartType) {
    this[internal.setState]({ panelPartType });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);

    if (changed.headerPartType) {
      template.transmute(
        this[internal.ids].header,
        this[internal.state].headerPartType
      );
      this[internal.ids].header.addEventListener("click", () => {
        this[internal.raiseChangeEvents] = true;
        this.toggle();
        this[internal.raiseChangeEvents] = false;
      });
    }

    if (changed.panelPartType) {
      template.transmute(
        this[internal.ids].panel,
        this[internal.state].panelPartType
      );
    }

    if (changed.togglePartType) {
      template.transmute(
        this[internal.ids].toggle,
        this[internal.state].togglePartType
      );
    }

    if (changed.opened || changed.togglePartType) {
      const { opened } = this[internal.state];

      this[internal.ids].header.setAttribute(
        "aria-expanded",
        opened.toString()
      );

      /** @type {any} */ const toggle = this[internal.ids].toggle;
      if ("direction" in toggle) {
        toggle.direction = opened ? "up" : "down";
      }

      if ("opened" in this[internal.ids].panel) {
        /** @type {any} */ (this[internal.ids].panel).opened = opened;
      }
    }
  }

  get [internal.template]() {
    // Default expand/collapse icons from Google's Material Design collection.
    return template.html`
      <style>
        :host {
          display: block;
        }

        [part~="header"] {
          display: flex;
        }

        @media (hover: hover), (any-hover: hover) {
          [part~="header"]:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }

        .headerElement {
          align-self: center;
        }

        #headerContainer {
          flex: 1;
          text-align: start;
        }
      </style>
      <div id="header" part="header">
        <div id="headerContainer" class="headerElement">
          <slot name="header"></slot>
        </div>
        <div id="toggle" part="toggle" class="headerElement">
          <slot name="toggleSlot"></slot>
        </div>
      </div>
      <div id="panel" part="panel" role="none">
        <slot></slot>
      </div>
    `;
  }

  /**
   * The class, tag, or template used to create the `toggle` part – the element
   * that lets the user know they can expand/collapse the section.
   *
   * @type {PartDescriptor}
   * @default UpDownToggle
   */
  get togglePartType() {
    return this[internal.state].togglePartType;
  }
  set togglePartType(togglePartType) {
    this[internal.setState]({ togglePartType });
  }
}

export default ExpandableSection;
