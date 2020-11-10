import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { transmute } from "../core/template.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import Button from "./Button.js";
import ExpandablePanel from "./ExpandablePanel.js";
import {
  defaultState,
  ids,
  raiseChangeEvents,
  render,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
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
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      headerPartType: Button,
      panelPartType: ExpandablePanel,
      role: "region",
      togglePartType: UpDownToggle,
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
    return this[state].headerPartType;
  }
  set headerPartType(headerPartType) {
    this[setState]({ headerPartType });
  }

  /**
   * The class or tag used to create the `panel` part - the container
   * for the expandable/collapsible content.
   *
   * @type {PartDescriptor}
   * @default ExpandablePanel
   */
  get panelPartType() {
    return this[state].panelPartType;
  }
  set panelPartType(panelPartType) {
    this[setState]({ panelPartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.headerPartType) {
      this[ids].header.addEventListener("click", () => {
        this[raiseChangeEvents] = true;
        this.toggle();
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.opened || changed.togglePartType) {
      const { opened } = this[state];

      this[ids].header.setAttribute("aria-expanded", opened.toString());

      /** @type {any} */ const toggle = this[ids].toggle;
      if ("direction" in toggle) {
        toggle.direction = opened ? "up" : "down";
      }

      if ("opened" in this[ids].panel) {
        /** @type {any} */ (this[ids].panel).opened = opened;
      }
    }
  }

  get [template]() {
    // Default expand/collapse icons from Google's Material Design collection.
    const result = templateFrom.html`
      <style>
        :host {
          display: inline-block;
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

    renderParts(result.content, this[state]);

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
    return this[state].togglePartType;
  }
  set togglePartType(togglePartType) {
    this[setState]({ togglePartType });
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
      transmute(header, headerPartType);
    }
  }
  if (!changed || changed.panelPartType) {
    const { panelPartType } = state;
    const panel = root.getElementById("panel");
    if (panel) {
      transmute(panel, panelPartType);
    }
  }
  if (!changed || changed.togglePartType) {
    const { togglePartType } = state;
    const toggle = root.getElementById("toggle");
    if (toggle) {
      transmute(toggle, togglePartType);
    }
  }
}

export default ExpandableSection;
