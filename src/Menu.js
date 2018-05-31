import ListBox from './ListBox.js';
import { merge } from './updates.js';


/**
 * A menu.
 * 
 * This holds the contents of the menu. This isn't a button or element in a menu
 * bar that opens a menu.
 */
class Menu extends ListBox {

  // Filter the set of items to ignore disabled items.
  itemsForState(state) {
    const base = super.itemsForState(state);
    return base ?
      base.filter((/** @type {any} */ item) => !item.disabled) :
      [];
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      role: 'menu',
      itemRole: 'menuitem'
    });
  }

}


export default Menu;
customElements.define('elix-menu', Menu);
