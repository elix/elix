import * as symbols from '../../src/symbols.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';
import SingleSelectionMixin from '../../src/SingleSelectionMixin.js';


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

  itemUpdates(item, calcs, original) {
    /* Map item selection to a `selected` CSS class. */
    return {
      classes: {
        selected: calcs.selected
      }
    }
  }
}


customElements.define('single-selection-demo', SingleSelectionDemo);
export default SingleSelectionDemo;
