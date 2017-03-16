import SingleSelectionMixin from '../../mixins/SingleSelectionMixin';
import symbols from '../../mixins/symbols';


/*
 * A very simple component to show the application of SingleSelectionMixin.
 *
 * For a more complete demo using SingleSelectionMixin, see the ListBox demo.
 */
export default class SingleSelectionDemo extends SingleSelectionMixin(HTMLElement) {

  constructor() {
    super();
    this.addEventListener('mousedown', event => {
      this[symbols.raiseChangeEvents] = true;
      this.selectedItem = event.target;
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
