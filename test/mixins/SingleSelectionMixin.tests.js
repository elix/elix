import { assert } from 'chai';
import flushPolyfills from '../../test/flushPolyfills.js';
import SingleSelectionMixin from '../../mixins/SingleSelectionMixin.js';
import symbols from '../../mixins/symbols.js';

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
    const fixture = document.createElement('items-selection-test');
    assert.isNull(fixture.selectedItem);
    assert.equal(fixture.selectedIndex, -1);
  });

  it("updates selectingIndex when selectedItem changes", () => {
    const fixture = createSampleElement();
    fixture.selectedIndex = 2;
    assert.equal(fixture.selectedItem, fixture.children[2]);
  });

  it("updates selectedItem when selectedIndex changes", () => {
    const fixture = createSampleElement();
    fixture.selectedItem = fixture.children[2];
    assert.equal(fixture.selectedIndex, 2);
  });

  it("updates selectedIndex if selectedItem changes position", () => {
    const fixture = createSampleElement();
    const item = fixture.children[0];
    fixture.selectedItem = item;
    assert.equal(fixture.selectedIndex, 0);
    fixture.appendChild(item); // Move to end.
    fixture[symbols.itemsChanged]();
    assert.equal(fixture.selectedItem, item);
    assert.equal(fixture.selectedIndex, 2);
  });

  it("can set selectedIndex in markup", () => {
    container.innerHTML = `
      <items-selection-test selected-index="0">
        <div></div>
      </items-selection-test>
    `;
    flushPolyfills();
    const list = container.querySelector('items-selection-test');
    const item = list.children[0];
    assert.equal(list.selectedItem, item);
  });

  it("can advance the selection to the next item", () => {
    const fixture = createSampleElement();
    assert.equal(fixture.selectedIndex, -1);
    fixture.selectNext();
    assert.equal(fixture.selectedIndex, 0);
    fixture.selectNext();
    fixture.selectNext();
    assert.equal(fixture.selectedIndex, 2);
    fixture.selectNext(); // Moving past last item should have no effect.
    assert.equal(fixture.selectedIndex, 2);
  });

  it("can move the selection to the previous item", () => {
    const fixture = createSampleElement();
    assert.equal(fixture.selectedIndex, -1);
    fixture.selectPrevious();
    assert.equal(fixture.selectedIndex, 2); // last item
    fixture.selectPrevious();
    assert.equal(fixture.selectedIndex, 1);
  });

  it("can wrap the selection from the last to the first item", () => {
    const fixture = createSampleElement();
    fixture.selectionWraps = true;
    fixture.selectedIndex = 2;
    fixture.selectNext();
    assert.equal(fixture.selectedIndex, 0);
  });

  it("tracks selection of first item when no item is selected", () => {
    const fixture = createSampleElement();
    assert.equal(fixture.selectedIndex, -1);
    fixture.selectionRequired = true;
    assert.equal(fixture.selectedIndex, 0);
  });

  it("tracks selection when current item (not last place) is removed", () => {
    const fixture = createSampleElement();
    fixture.selectionRequired = true;
    const originalItem1 = fixture.children[1];
    fixture.selectedIndex = 0;
    fixture.removeChild(fixture.children[0]);
    fixture[symbols.itemsChanged]();
    assert.equal(fixture.selectedIndex, 0);
    assert.equal(fixture.selectedItem, originalItem1);
  });

  it("tracks selection when current item in last place is removed", () => {
    const fixture = createSampleElement();
    fixture.selectionRequired = true;
    const originalItem1 = fixture.children[1];
    fixture.selectedIndex = 2;
    fixture.removeChild(fixture.children[2]);
    fixture[symbols.itemsChanged]();
    assert.equal(fixture.selectedIndex, 1);
    assert.equal(fixture.selectedItem, originalItem1);
  });

  it("tracks selection when item other than current item is removed", () => {
    const fixture = createSampleElement();
    fixture.selectionRequired = true;
    const originalItem1 = fixture.children[1];
    fixture.selectedIndex = 1;
    fixture.removeChild(fixture.children[0]);
    fixture[symbols.itemsChanged]();
    assert.equal(fixture.selectedIndex, 0);
    assert.equal(fixture.selectedItem, originalItem1);
  });

  it("drops selection when the last item is removed", () => {
    const fixture = createSampleElement();
    fixture.selectionRequired = true;
    fixture.selectedIndex = 0;
    fixture.removeChild(fixture.children[0]);
    fixture.removeChild(fixture.children[0]);
    fixture.removeChild(fixture.children[0]);
    fixture[symbols.itemsChanged]();
    assert.equal(fixture.selectedIndex, -1);
    assert.equal(fixture.selectedItem, null);
  });

  it("sets canSelectNext/canSelectPrevious with no wrapping", () => {
    const fixture = createSampleElement();
    assert(!fixture.selectionWraps);

    // No selection yet
    assert.equal(fixture.selectedIndex, -1);
    assert(fixture.canSelectNext);
    assert(fixture.canSelectPrevious);

    // Start of list
    fixture.selectFirst();
    assert(fixture.canSelectNext);
    assert(!fixture.canSelectPrevious);

    // Middle of list
    fixture.selectNext();
    assert(fixture.canSelectNext);
    assert(fixture.canSelectPrevious);

    // End of list
    fixture.selectLast();
    assert(!fixture.canSelectNext);
    assert(fixture.canSelectPrevious);
  });

  it("sets canSelectNext/canSelectPrevious with wrapping", () => {
    const fixture = createSampleElement();
    fixture.selectionWraps = true;

    // Start of list
    fixture.selectFirst();
    assert(fixture.canSelectNext);
    assert(fixture.canSelectPrevious);

    // End of list
    fixture.selectLast();
    assert(fixture.canSelectNext);
    assert(fixture.canSelectPrevious);
  });

  it("changing selection through (simulated) user interaction raises the selected-item-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('selected-item-changed', () => {
      done();
    });
    container.appendChild(fixture);

    fixture[symbols.raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectedIndex = 1;
    fixture[symbols.raiseChangeEvents] = false;
  });

  it("changing selection programmatically does not raise the selected-item-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('selected-item-changed', () => {
      assert.fail(null, null, 'selected-item-changed event should not have been raised in response to programmatic property change');
    });
    container.appendChild(fixture);
    fixture.selectedIndex = 1; // This should not trigger events.
    // Give event handler a chance to run (but it shouldn't).
    setTimeout(done);
  });

  it("raises can-select-previous-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('can-select-previous-changed', () => {
      assert.equal(fixture.selectedIndex, 0);
      assert(!fixture.canSelectPrevious);
      done();
    });
    container.appendChild(fixture);
    assert(fixture.canSelectPrevious);

    fixture[symbols.raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectFirst();
    fixture[symbols.raiseChangeEvents] = false;
  });

  it("raises can-select-next-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('can-select-next-changed', () => {
      assert.equal(fixture.selectedIndex, 2);
      assert(!fixture.canSelectNext);
      done();
    });
    container.appendChild(fixture);
    assert(fixture.canSelectNext);

    fixture[symbols.raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectLast();
    fixture.fooBar();
    fixture[symbols.raiseChangeEvents] = false;
  });

});


/**
 * @returns {SingleSelectionTest}
 */
function createSampleElement() {
  const fixture = document.createElement('items-selection-test');
  ['Zero', 'One', 'Two'].forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    fixture.appendChild(div);
  });
  fixture[symbols.itemsChanged]();
  return fixture;
}