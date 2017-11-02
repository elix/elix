import ContentItemsMixin from '../../mixins/ContentItemsMixin.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';
import SingleSelectionMixin from '../../mixins/SingleSelectionMixin.js';
import symbols from '../../mixins/symbols.js';


const Base =
  ContentItemsMixin(
  ReactiveMixin(
  SingleSelectionMixin(
    HTMLElement
  )));


/*
 * A very simple component to show the application of SingleSelectionMixin
 * and ContentItemsMixin.
 *
 * For a more complete demo using SingleSelectionMixin, see the ListBox demo.
 * 
 */
class SingleSelectionDemo extends Base {

  constructor() {
    super();
    /* Clicking an item selects it. */
    this.addEventListener('mousedown', event => {
      if (event.target instanceof Element) {
        this[symbols.raiseChangeEvents] = true;
        this.selectedItem = event.target;
        event.stopPropagation();
        this[symbols.raiseChangeEvents] = false;
      }
    });
  }

  get defaultState() {
    /* Simplistic implementation of content returns light DOM children. */
    return Object.assign({}, super.defaultState, {
      content: this.children
    });
  }

  itemProps(item, index, original) {
    /* Map item selection to a `selected` CSS class. */
    return {
      classes: {
        selected: index === this.selectedIndex
      }
    }
  }
}


customElements.define('single-selection-demo', SingleSelectionDemo);
export default SingleSelectionDemo;
