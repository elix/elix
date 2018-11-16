import * as symbols from './symbols.js';
import { merge } from './updates.js';


const itemsChangedListenerKey = Symbol('itemsChangedListener');
const previousSelectionDelegateKey = Symbol('previousSelectionDelegate');
const selectedIndexChangedListenerKey = Symbol('selectedIndexChangedListener');


// TODO: Document that the component should define its own selectedIndex and
// items properties, usually via SingleSelectionMixin.
export default function DelegateSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class DelegateSelection extends Base {

    constructor() {
      super();
      this[itemsChangedListenerKey] = event => {
        /** @type {any} */
        const cast = event.target;
        const delegateItems = cast.items;
        if (this.state.items !== delegateItems) {
          this.setState({
            items: delegateItems
          });
        }
      };
      this[selectedIndexChangedListenerKey] = event => {
        /** @type {any} */
        const cast = event;
        const delegateSelectedIndex = cast.detail.selectedIndex;
        if (this.state.selectedIndex !== delegateSelectedIndex) {
          this.setState({
            selectedIndex: delegateSelectedIndex
          });
        }
      };
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      listenToDelegateEvents(this);
    }

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      listenToDelegateEvents(this);
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        items: null
      });
    }

    get items() {
      return this.state ? this.state.items : null;
    }

    itemsForState(state) {
      return state.items;
    }

    get [symbols.selectionDelegate]() {
      const result = super[symbols.selectionDelegate];
      if (typeof result === 'undefined') {
        throw `To use DelegateSelectionMixin, ${this.constructor.name} must define a getter for [symbols.selectionDelegate].`;
      }
      return result;
    }

    get updates() {
      const selectionDelegate = this[symbols.selectionDelegate];
      const selectionDelegateId = selectionDelegate.id;
      if (!selectionDelegateId) {
        throw `DelegateSelectionMixin requires ${this.constructor.name} to assign an ID to the element handling selection.`;
      }
      const selectedIndex = this.state.selectedIndex;
      return merge(super.updates, {
        $: {
          [selectionDelegateId]: {
            selectedIndex
          }
        }
      });
    }

  }

  return DelegateSelection;
}


function listenToDelegateEvents(element) {
  const selectionDelegate = element[symbols.selectionDelegate];
  const previousSelectionDelegate = element[previousSelectionDelegateKey];
  if (selectionDelegate !== previousSelectionDelegate) {
    if (previousSelectionDelegate) {
      // Stop listening to events on previous delegate.
      previousSelectionDelegate.removeEventListener(element[itemsChangedListenerKey]);
      previousSelectionDelegate.removeEventListener(element[selectedIndexChangedListenerKey]);
    }
    // Start listening to events on new delegate.
    selectionDelegate.addEventListener('items-changed', element[itemsChangedListenerKey]);
    selectionDelegate.addEventListener('selected-index-changed', element[selectedIndexChangedListenerKey]);
  }
}
