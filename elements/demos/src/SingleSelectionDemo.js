import SingleSelectionMixin from '../../elix-mixins/src/SingleSelectionMixin';
import symbols from '../../elix-mixins/src/symbols';


export default class SingleSelectionDemo extends SingleSelectionMixin(HTMLElement) {

  constructor() {
    super();

    // When a child is clicked, set the selectedItem.
    this.addEventListener('click', event => {
      this[symbols.raiseChangeEvents] = true;
      this.selectedItem = event.target !== this ?
        event.target :  // Clicked on an item
        null;           // Clicked on element background
      event.stopPropagation();
      this[symbols.raiseChangeEvents] = false;
    });
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (super.attributeChangedCallback) { super.attributeChangedCallback(attributeName, oldValue, newValue); }
    if (attributeName === 'selected-index') {
      this.selectedIndex = newValue;
    }
  }

  // Map item selection to a `selected` CSS class.
  [symbols.itemSelected](item, selected) {
    if (super[symbols.itemSelected]) { super[symbols.itemSelected](item, selected); }
    item.classList.toggle('selected', selected);
  }

  // Simplistic implementation of items property — doesn't handle redistribution.
  get items() {
    return this.children;
  }

  static get observedAttributes() {
    return ['selected-index'];
  }

}


customElements.define('single-selection-demo', SingleSelectionDemo);
