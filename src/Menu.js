import ListBox from './ListBox.js';


/**
 * A menu.
 * 
 * This holds the contents of the menu. This isn't a button or element in a menu
 * bar that opens a menu.
 */
class Menu extends ListBox {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      role: 'menu',
      itemRole: 'menuitem'
    });
  }

}


export default Menu;
customElements.define('elix-menu', Menu);
