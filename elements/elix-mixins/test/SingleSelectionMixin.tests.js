import { assert } from 'chai';
import microtask from '../src/microtask';
import SingleSelectionMixin from '../src/SingleSelectionMixin';
import symbols from '../src/symbols';


class SingleSelectionTest extends SingleSelectionMixin(HTMLElement) {

  attributeChangedCallback(attributeName, oldValue, newValue) {
	  if (super.attributeChangedCallback) { super.attributeChangedCallback(); }
    if (attributeName === 'selected-index') {
      this.selectedIndex = newValue;
    }
  }

  indexOfItem(item) {
    return this.items.indexOf(item);
  }

  // This simplistic `items` implementation doesn't track changes, so tests
  // will need to invoke `itemsChanged` manually.
  get items() {
    // Convert children to array in a way IE 11 can handle.
    return Array.prototype.slice.call(this.children);
  }

  static get observedAttributes() {
    return ['selected-index'];
  }

}
customElements.define('items-selection-test', SingleSelectionTest);


describe("SingleSelectionMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("has selectedItem initially null", () => {
    const element = document.createElement('items-selection-test');
    assert.isNull(element.selectedItem);
    assert.equal(element.selectedIndex, -1);
  });

  it("updates selectingIndex when selectedItem changes", () => {
    const element = createSampleElement();
    element.selectedIndex = 2;
    assert.equal(element.selectedItem, element.children[2]);
  });

  it("updates selectedItem when selectedIndex changes", () => {
    const element = createSampleElement();
    element.selectedItem = element.children[2];
    assert.equal(element.selectedIndex, 2);
  });

  it("updates selectedIndex if selectedItem changes position", () => {
    const element = createSampleElement();
    const item = element.children[0];
    element.selectedItem = item;
    assert.equal(element.selectedIndex, 0);
    element.appendChild(item); // Move to end.
    element[symbols.itemsChanged]();
    assert.equal(element.selectedItem, item);
    assert.equal(element.selectedIndex, 2);
  });

  it("can set selectedIndex in markup", done => {
    container.innerHTML = `
      <items-selection-test selected-index="0">
        <div></div>
      </items-selection-test>
    `;
    // Timeout gives polyfill time to upgrade element.
    setTimeout(() => {
      const list = container.querySelector('items-selection-test');
      const item = list.children[0];
      assert.equal(list.selectedItem, item);
      done();
    });
  });

  it("can advance the selection to the next item", () => {
    const element = createSampleElement();
    assert.equal(element.selectedIndex, -1);
    element.selectNext();
    assert.equal(element.selectedIndex, 0);
    element.selectNext();
    element.selectNext();
    assert.equal(element.selectedIndex, 2);
    element.selectNext(); // Moving past last item should have no effect.
    assert.equal(element.selectedIndex, 2);
  });

  it("can move the selection to the previous item", () => {
    const element = createSampleElement();
    assert.equal(element.selectedIndex, -1);
    element.selectPrevious();
    assert.equal(element.selectedIndex, 2); // last item
    element.selectPrevious();
    assert.equal(element.selectedIndex, 1);
  });

  it("can wrap the selection from the last to the first item", () => {
    const element = createSampleElement();
    element.selectionWraps = true;
    element.selectedIndex = 2;
    element.selectNext();
    assert.equal(element.selectedIndex, 0);
  });

  it("tracks selection of first item when no item is selected", () => {
    const element = createSampleElement();
    assert.equal(element.selectedIndex, -1);
    element.selectionRequired = true;
    assert.equal(element.selectedIndex, 0);
  });

  it("tracks selection when current item (not last place) is removed", () => {
    const element = createSampleElement();
    element.selectionRequired = true;
    const originalItem1 = element.children[1];
    element.selectedIndex = 0;
    element.removeChild(element.children[0]);
    element[symbols.itemsChanged]();
    assert.equal(element.selectedIndex, 0);
    assert.equal(element.selectedItem, originalItem1);
  });

  it("tracks selection when current item in last place is removed", () => {
    const element = createSampleElement();
    element.selectionRequired = true;
    const originalItem1 = element.children[1];
    element.selectedIndex = 2;
    element.removeChild(element.children[2]);
    element[symbols.itemsChanged]();
    assert.equal(element.selectedIndex, 1);
    assert.equal(element.selectedItem, originalItem1);
  });

  it("tracks selection when item other than current item is removed", () => {
    const element = createSampleElement();
    element.selectionRequired = true;
    const originalItem1 = element.children[1];
    element.selectedIndex = 1;
    element.removeChild(element.children[0]);
    element[symbols.itemsChanged]();
    assert.equal(element.selectedIndex, 0);
    assert.equal(element.selectedItem, originalItem1);
  });

  it("drops selection when the last item is removed", () => {
    const element = createSampleElement();
    element.selectionRequired = true;
    element.selectedIndex = 0;
    element.removeChild(element.children[0]);
    element.removeChild(element.children[0]);
    element.removeChild(element.children[0]);
    element[symbols.itemsChanged]();
    assert.equal(element.selectedIndex, -1);
    assert.equal(element.selectedItem, null);
  });

  it("sets canSelectNext/canSelectPrevious with no wrapping", () => {
    const element = createSampleElement();
    assert(!element.selectionWraps);

    // No selection yet
    assert.equal(element.selectedIndex, -1);
    assert(element.canSelectNext);
    assert(element.canSelectPrevious);

    // Start of list
    element.selectFirst();
    assert(element.canSelectNext);
    assert(!element.canSelectPrevious);

    // Middle of list
    element.selectNext();
    assert(element.canSelectNext);
    assert(element.canSelectPrevious);

    // End of list
    element.selectLast();
    assert(!element.canSelectNext);
    assert(element.canSelectPrevious);
  });

  it("sets canSelectNext/canSelectPrevious with wrapping", () => {
    const element = createSampleElement();
    element.selectionWraps = true;

    // Start of list
    element.selectFirst();
    assert(element.canSelectNext);
    assert(element.canSelectPrevious);

    // End of list
    element.selectLast();
    assert(element.canSelectNext);
    assert(element.canSelectPrevious);
  });

  it("changing selection through (simulated) user interaction raises the selected-item-changed event", done => {
    const element = createSampleElement();
    element.addEventListener('selected-item-changed', () => {
      done();
    });
    container.appendChild(element);

    element[symbols.raiseChangeEvents] = true; // Simulate user interaction
    element.selectedIndex = 1;
    element[symbols.raiseChangeEvents] = false;
  });

  it("changing selection programmatically does not raise the selected-item-changed event", done => {
    const element = createSampleElement();
    element.addEventListener('selected-item-changed', () => {
      assert.fail(null, null, 'selected-item-changed event should not have been raised in response to programmatic property change');
    });
    container.appendChild(element);
    element.selectedIndex = 1; // This should not trigger events.
    // Give event handler a chance to run (but it shouldn't).
    microtask(done);
  });

  it("raises can-select-previous-changed event", done => {
    const element = createSampleElement();
    element.addEventListener('can-select-previous-changed', () => {
      assert.equal(element.selectedIndex, 0);
      assert(!element.canSelectPrevious);
      done();
    });
    container.appendChild(element);
    assert(element.canSelectPrevious);

    element[symbols.raiseChangeEvents] = true; // Simulate user interaction
    element.selectFirst();
    element[symbols.raiseChangeEvents] = false;
  });

  it("raises can-select-next-changed event", done => {
    const element = createSampleElement();
    element.addEventListener('can-select-next-changed', () => {
      assert.equal(element.selectedIndex, 2);
      assert(!element.canSelectNext);
      done();
    });
    container.appendChild(element);
    assert(element.canSelectNext);

    element[symbols.raiseChangeEvents] = true; // Simulate user interaction
    element.selectLast();
    element[symbols.raiseChangeEvents] = false;
  });

});

function createSampleElement() {
  const element = document.createElement('items-selection-test');
  ['Zero', 'One', 'Two'].forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    element.appendChild(div);
  });
  element[symbols.itemsChanged]();
  return element;
}