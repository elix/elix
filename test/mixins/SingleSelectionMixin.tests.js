import { assert } from 'chai';
import flushPolyfills from '../../test/flushPolyfills.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';
import SingleSelectionMixin from '../../mixins/SingleSelectionMixin.js';
import symbols from '../../mixins/symbols.js';

class SingleSelectionTest extends ReactiveMixin(SingleSelectionMixin(HTMLElement)) {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      items: []
    });
  }

  get items() {
    return this.state.items;
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

  it("has selectedIndex initially -1", () => {
    const fixture = document.createElement('items-selection-test');
    assert.equal(fixture.state.selectedIndex, -1);
  });

  it("can advance the selection to the next item", () => {
    const fixture = createSampleElement();
    assert.equal(fixture.state.selectedIndex, -1);
    fixture.selectNext();
    assert.equal(fixture.state.selectedIndex, 0);
    fixture.selectNext();
    fixture.selectNext();
    assert.equal(fixture.state.selectedIndex, 2);
    fixture.selectNext(); // Moving past last item should have no effect.
    assert.equal(fixture.state.selectedIndex, 2);
  });

  it("can move the selection to the previous item", () => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.selectPrevious();
    assert.equal(fixture.state.selectedIndex, 2); // last item
    fixture.selectPrevious();
    assert.equal(fixture.state.selectedIndex, 1);
  });

  it("can wrap the selection from the last to the first item", () => {
    const fixture = createSampleElement();
    fixture.selectionWraps = true;
    fixture.setState({ selectedIndex: 2 });
    fixture.selectNext();
    assert.equal(fixture.state.selectedIndex, 0);
  });

  it("tracks selection of first item when no item is selected", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture.state.selectedIndex, -1);
    fixture.setState({ selectionRequired: true });
    Promise.resolve().then(() => {
      assert.equal(fixture.state.selectedIndex, 0);
      done();
    });
  });

  it("tracks selection when current item (not last place) is removed", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    const items = fixture.items.slice();
    items.splice(0, 1);
    fixture.setState({
      items,
      selectedIndex: 0,
      selectionRequired: true
    });
    Promise.resolve().then(() => {
      assert.equal(fixture.state.selectedIndex, 0);
      done();
    });
  });

  it("tracks selection when current item in last place is removed", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    const items = fixture.items.slice();
    items.splice(2, 1);
    fixture.setState({
      items,
      selectedIndex: 2,
      selectionRequired: true
    });
    Promise.resolve().then(() => {
      assert.equal(fixture.state.selectedIndex, 1);
      done();
    });
  });

  it("drops selection when the last item is removed", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.setState({
      items: [],
      selectedIndex: 0,
      selectionRequired: true
    });
    Promise.resolve().then(() => {
      assert.equal(fixture.state.selectedIndex, -1);
      done();
    });
  });

  it("sets canSelectNext/canSelectPrevious with no wrapping", () => {
    const fixture = createSampleElement();
    assert(!fixture.selectionWraps);

    // No selection yet
    assert.equal(fixture.state.selectedIndex, -1);
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

  it.skip("changing selection through (simulated) user interaction raises the selected-item-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('selected-item-changed', () => {
      done();
    });
    container.appendChild(fixture);

    fixture[symbols.raiseChangeEvents] = true; // Simulate user interaction
    fixture.setState({ selectedIndex: 1 });
    fixture[symbols.raiseChangeEvents] = false;
  });

  it.skip("changing selection programmatically does not raise the selected-item-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('selected-item-changed', () => {
      assert.fail(null, null, 'selected-item-changed event should not have been raised in response to programmatic property change');
    });
    container.appendChild(fixture);
    fixture.setState({ selectedIndex: 1 }); // This should not trigger events.
    // Give event handler a chance to run (but it shouldn't).
    setTimeout(done);
  });

  it.skip("raises can-select-previous-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('can-select-previous-changed', () => {
      assert.equal(fixture.state.selectedIndex, 0);
      assert(!fixture.canSelectPrevious);
      done();
    });
    container.appendChild(fixture);
    assert(fixture.canSelectPrevious);

    fixture[symbols.raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectFirst();
    fixture[symbols.raiseChangeEvents] = false;
  });

  it.skip("raises can-select-next-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('can-select-next-changed', () => {
      assert.equal(fixture.state.selectedIndex, 2);
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
  // To keep this unit test collection focus on selection, and not on tracking
  // children as items, we just use a plain array of item objects instead.
  fixture.setState({
    items: ['Zero', 'One', 'Two']
  });
  return fixture;
}
