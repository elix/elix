import * as symbols from './symbols.js';
import { merge } from './updates.js';


const selectedIndexChangedListenerKey = Symbol('selectedIndexChangedListener');
const previousSelectionDelegateKey = Symbol('previousSelectionDelegate');


// TODO: Document that the component should define its own selectedIndex and
// items properties, usually via SingleSelectionMixin.
export default function DelegateSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class DelegateSelection extends Base {

    constructor() {
      super();
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
      listenToSelectedIndexChanged(this);
    }

    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      listenToSelectedIndexChanged(this);
    }

    // TODO: Track items as state, handle items-changed event.
    get items() {
      const selectionDelegate = this[symbols.selectionDelegate];
      return selectionDelegate ?
        selectionDelegate.items :
        null;
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


function listenToSelectedIndexChanged(element) {
  const selectionDelegate = element[symbols.selectionDelegate];
  const previousSelectionDelegate = element[previousSelectionDelegateKey];
  if (selectionDelegate !== previousSelectionDelegate) {
    if (previousSelectionDelegate) {
      // Stop listening to selected-index-changed events on previous delegate.
      previousSelectionDelegate.removeEventListener(element[selectedIndexChangedListenerKey]);
    }
    // Start listening to selected-index-changed events on new delegate.
    selectionDelegate.addEventListener('selected-index-changed', element[selectedIndexChangedListenerKey]);
  }
}