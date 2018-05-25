import PopupMenuButton from './PopupMenuButton.js';


class DropdownList extends PopupMenuButton {

  itemSelected(item) {
    this.$.valueContainer.textContent = item.textContent;
  }

}


export default DropdownList;
customElements.define('elix-dropdown-list', DropdownList);
