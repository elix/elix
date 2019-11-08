import * as internal from './internal.js';
import * as template from './template.js';
import AriaRoleMixin from './AriaRoleMixin.js';
import ExpandablePanel from './ExpandablePanel.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SeamlessButton from './SeamlessButton.js';

const Base = AriaRoleMixin(OpenCloseMixin(ReactiveElement));

/**
 * A document section with a header that can be expanded or collapsed
 *
 * @inherits ReactiveElement
 * @mixes AriaRoleMixin
 * @mixes OpenCloseMixin
 * @part collapse-icon - the default icon shown when the panel is expanded
 * @part expand-icon - the default icon shown when the panel is collapsed
 * @part toggle - contains the icons or other element which lets the user know they
 * can expand/collapse the panel
 * @part toggle-icon - both of the default icons used to expand/collapse the panel
 * @part {SeamlessButton} header - the header that can be clicked/tapped to expand or collapse the panel
 * @part {ExpandablePanel} panel - contains the component's expandable/collapsible content
 */
class ExpandableSection extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      headerPartType: SeamlessButton,
      panelPartType: ExpandablePanel,
      role: 'region'
    });
  }

  /**
   * The class, tag, or template used to create the `header` part - the header
   * region the user can tap/click to expand or collapse the section.
   *
   * @type {PartDescriptor}
   * @default SeamlessButton
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
      this[internal.ids].header.addEventListener('click', () => {
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
    if (changed.opened) {
      const { opened } = this[internal.state];
      this[internal.ids].header.setAttribute(
        'aria-expanded',
        opened.toString()
      );
      if (this[internal.ids].collapseIcon) {
        this[internal.ids].collapseIcon.style.display = opened
          ? 'block'
          : 'none';
      }
      if (this[internal.ids].expandIcon) {
        this[internal.ids].expandIcon.style.display = opened ? 'none' : 'block';
      }
      if ('opened' in this[internal.ids].panel) {
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

        #header {
          display: flex;
        }

        @media (hover: hover), (any-hover: hover) {
          #header:hover {
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

        #toggle {
          margin: 0.5em;
        }
      </style>
      <div id="header" part="header">
        <div id="headerContainer" class="headerElement">
          <slot name="header"></slot>
        </div>
        <div id="toggle" part="toggle" class="headerElement">
          <slot name="toggleSlot">
            <svg id="collapseIcon" part="toggle-icon collapse-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
            </svg>
            <svg id="expandIcon" part="toggle-icon expand-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
            </svg>
          </slot>
        </div>
      </div>
      <div id="panel" part="panel" role="none">
        <slot></slot>
      </div>
    `;
  }
}

export default ExpandableSection;
