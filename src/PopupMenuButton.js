import './Menu';
import PopupSource from './PopupSource.js';
import * as symbols from './symbols.js';


class PopupMenuButton extends PopupSource {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.popup.addEventListener('mouseup', event => {
      // TODO: Without this, clicking popup button opens popup then immediately closes it.
      const target = event.target;
      if (target !== this.$.popup) {
        this[symbols.raiseChangeEvents] = true;
        this.setState({
          selectedItem: target
        });
        this.close();
        this[symbols.raiseChangeEvents] = false;
      }
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }

    if (this.state.opened !== previousState.opened && this[symbols.raiseChangeEvents] &&
        this.state.selectedItem) {
      /**
       * Raised when the user selects a menu item.
       * 
       * @event PopupMenuButton#menu-item-selected
       */
      const event = new CustomEvent('menu-item-selected', {
        detail: {
          selectedItem: this.state.selectedItem
        }
      });
      this.dispatchEvent(event);
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedItem: null
    });
  }
  
  get popupTemplate() {
    const base = super.popupTemplate;
    const template = base.replace('<slot name="popup"></slot>', `
      <elix-menu>
        <slot name="popup"></slot>
      </elix-menu>
    `);
    return template;
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    if (state.opened && !this.opened && state.selectedItem) {
      // Clear any previously selected item.
      Object.assign(state, {
        selectedItem: null
      });
      result = false;
    }
    return result;
  }

}


export default PopupMenuButton;
customElements.define('elix-popup-menu-button', PopupMenuButton);
