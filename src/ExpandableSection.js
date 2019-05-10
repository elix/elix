import * as symbols from './symbols.js'
import * as template from './template.js';
import ExpandablePanel from './ExpandablePanel.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  OpenCloseMixin(
    ReactiveElement
  );


/**
 * A document section with a header that can be expanded or collapsed
 * 
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 * @elementrole {SeamlessButton} header
 * @elementrole {ExpandablePanel} panel
 */
class ExpandableSection extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      headerRole: SeamlessButton,
      panelRole: ExpandablePanel,
      role: 'region'
    });
  }

  /**
   * The class, tag, or template used to create the clickable header.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default SeamlessButton
   */
  get headerRole() {
    return this.state.headerRole;
  }
  set headerRole(headerRole) {
    this.setState({ headerRole });
  }

  /**
   * The class, tag, or template used to create the expandable panel.
   * 
   * @type {function|string|HTMLTemplateElement}
   * @default ExpandablePanel
   */
  get panelRole() {
    return this.state.panelRole;
  }
  set panelRole(panelRole) {
    this.setState({ panelRole });
  }

  [symbols.populate](state, changed) {
    super[symbols.populate](state, changed);
    if (changed.headerRole) {
      template.transmute(this.$.header, this.state.headerRole);
      this.$.header.addEventListener('click', () => {
        this[symbols.raiseChangeEvents] = true;
        this.toggle();
        this[symbols.raiseChangeEvents] = false;
      });
    }
    if (changed.panelRole) {
      template.transmute(this.$.panel, this.state.panelRole);
    }
  }

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.originalAttributes || changed.role) {
      const originalRole = state.originalAttributes && state.originalAttributes.role;
      if (!originalRole) {
        this.setAttribute('role', state.role);
      }
    }
    if (changed.opened) {
      const { opened } = state;
      this.$.header.setAttribute('aria-expanded', opened);
      if (this.$.collapseIcon) {
        this.$.collapseIcon.style.display = opened ? 'block' : 'none';
      }
      if (this.$.expandIcon) {
        this.$.expandIcon.style.display = opened ? 'none' : 'block';
      }
      if ('opened' in this.$.panel) {
        /** @type {any} */ (this.$.panel).opened = opened;
      }
    }
  }

  get [symbols.template]() {
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
