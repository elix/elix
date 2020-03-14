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
   * The class or tag used to create the `header` part - the header
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
   * The class or tag used to create the `panel` part - the container
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

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    renderParts(this[internal.shadowRoot], this[internal.state], changed);

    if (changed.headerPartType) {
      this[internal.ids].header.addEventListener("click", () => {
        this[internal.raiseChangeEvents] = true;
        this.toggle();
        this[internal.raiseChangeEvents] = false;
      });
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
    const result = template.html`
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

    renderParts(result.content, this[internal.state]);

    return result;
  }

  /**
   * The class or tag used to create the `toggle` part – the element
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

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.headerPartType) {
    const { headerPartType } = state;
    const header = root.getElementById("header");
    if (header) {
      template.transmute(header, headerPartType);
    }
  }
  if (!changed || changed.panelPartType) {
    const { panelPartType } = state;
    const panel = root.getElementById("panel");
    if (panel) {
      template.transmute(panel, panelPartType);
    }
  }
  if (!changed || changed.togglePartType) {
    const { togglePartType } = state;
    const toggle = root.getElementById("toggle");
    if (toggle) {
      template.transmute(toggle, togglePartType);
    }
  }
}

export default ExpandableSection;
