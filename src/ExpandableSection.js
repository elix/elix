import * as internal from './internal.js';
import * as template from './template.js';
import AriaRoleMixin from './AriaRoleMixin.js';
import ExpandablePanel from './ExpandablePanel.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  AriaRoleMixin(
  OpenCloseMixin(
    ReactiveElement
  ));


/**
 * A document section with a header that can be expanded or collapsed
 * 
 * @inherits ReactiveElement
 * @mixes AriaRoleMixin
 * @mixes OpenCloseMixin
 * @elementrole {SeamlessButton} header
 * @elementrole {ExpandablePanel} panel
 */
class ExpandableSection extends Base {

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      headerRole: SeamlessButton,
      panelRole: ExpandablePanel,
      role: 'region'
    });
  }

  /**
   * The class, tag, or template used to create the clickable header.
   * 
   * @type {Role}
   * @default SeamlessButton
   */
  get headerRole() {
    return this[internal.state].headerRole;
  }
  set headerRole(headerRole) {
    this[internal.setState]({ headerRole });
  }

  /**
   * The class, tag, or template used to create the expandable panel.
   * 
   * @type {Role}
   * @default ExpandablePanel
   */
  get panelRole() {
    return this[internal.state].panelRole;
  }
  set panelRole(panelRole) {
    this[internal.setState]({ panelRole });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.headerRole) {
      template.transmute(this[internal.$].header, this[internal.state].headerRole);
      this[internal.$].header.addEventListener('click', () => {
        this[internal.raiseChangeEvents] = true;
        this.toggle();
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.panelRole) {
      template.transmute(this[internal.$].panel, this[internal.state].panelRole);
    }
    if (changed.opened) {
      const { opened } = this[internal.state];
      this[internal.$].header.setAttribute('aria-expanded', opened.toString());
      if (this[internal.$].collapseIcon) {
        this[internal.$].collapseIcon.style.display = opened ? 'block' : 'none';
      }
      if (this[internal.$].expandIcon) {
        this[internal.$].expandIcon.style.display = opened ? 'none' : 'block';
      }
      if ('opened' in this[internal.$].panel) {
        /** @type {any} */ (this[internal.$].panel).opened = opened;
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

        #toggleContainer {
          margin: 0.5em;
        }
      </style>
      <elix-seamless-button id="header">
        <div id="headerContainer" class="headerElement">
          <slot name="header"></slot>
        </div>
        <div id="toggleContainer" class="headerElement">
          <slot name="toggleSlot">
            <svg id="collapseIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
            </svg>
            <svg id="expandIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
            </svg>
          </slot>
        </div>
      </elix-seamless-button>
      <elix-expandable-panel id="panel" role="none">
        <slot></slot>
      </elix-expandable-panel>
    `;
  }

}


customElements.define('elix-expandable-section', ExpandableSection);
export default ExpandableSection;
