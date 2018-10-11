import './ExpandablePanel.js';
import './SeamlessButton.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js'
import * as template from './template.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  OpenCloseMixin(
    ReactiveElement
  );


/**
 * A document section with a header that can be used to expand or collapse
 * 
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 */
class ExpandableSection extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.headerBar.addEventListener('click', () => {
      this.toggle();
    });
    // HACK
    this.$.headerBar.$.inner.style.display = 'flex';
  }

  get updates() {
    
    const collapseIcon = this.$.collapseIcon;
    const expandIcon = this.$.expandIcon;

    // TODO: Default header content pulls text from aria-label.
    const opened = this.opened;
    return merge(
      super.updates,
      {
        attributes: {
          'aria-expanded': opened
        },
        $: {
          headerBar: {
          },
          panel: {
            opened
          }
        },
      },
      collapseIcon && {
        $: {
          collapseIcon: {
            style: {
              display: opened ? 'block' : 'none'
            }
          }
        }
      },
      expandIcon && {
        $: {
          expandIcon: {
            style: {
              display: opened ? 'none' : 'block'
            }
          }
        }
      }
    );
  }

  get [symbols.template]() {
    // TODO: Roles
    // Default expand/collapse icons from Google's Material Design collection.
    return template.html`
      <style>
        :host {
          display: block;
        }

        #headerBar {
          display: flex;
        }

        #headerBar:hover {
          opacity: 0.66;
        }

        #headerBar > * {
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
      <elix-seamless-button id="headerBar">
        <div id="headerContainer">
          <slot name="headerSlot"></slot>
        </div>
        <div id="toggleContainer">
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
