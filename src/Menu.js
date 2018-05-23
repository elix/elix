import ReactiveElement from './ReactiveElement.js';
import * as symbols from './symbols.js';


/**
 * A menu.
 * 
 * This holds the contents of the menu. This isn't a button or element in a menu
 * bar that opens a menu.
 */
class Menu extends ReactiveElement {

  get [symbols.template]() {
    return `
      <style>
        :host {
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
        }

        ::slotted(*) {
          padding: 0.5em;
        }

        ::slotted(li) {
          list-style: none;
        }

        ::slotted(:hover) {
          background: highlight;
          color: highlighttext;
          font-weight: inherit;
          min-height: inherit;
        }
      </style>
      <slot></slot>
    `;
  }

}


export default Menu;
customElements.define('elix-menu', Menu);
