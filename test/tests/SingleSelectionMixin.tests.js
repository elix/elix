import ReactiveMixin from '../../src/ReactiveMixin.js';
import SingleSelectionMixin from '../../src/SingleSelectionMixin.js';
import symbols from '../../src/symbols.js';


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

  it("tracks selection of first item when no item is selected", async () => {
    const fixture = createSampleElement();
    assert.equal(fixture.state.selectedIndex, -1);
    await fixture.setState({
      selectionRequired: true
    });
    fixture.render();
    assert.equal(fixture.state.selectedIndex, 0);
  });

  it("tracks selection when current item (not last place) is removed", async () => {
    const fixture = createSampleElement();
    const items = fixture.items.slice();
    items.splice(0, 1);
    await fixture.setState({
      items,
      selectedIndex: 0,
      selectionRequired: true
    });
    fixture.render();
    assert.equal(fixture.state.selectedIndex, 0);
  });

  it("tracks selection when current item in last place is removed", async () => {
    const fixture = createSampleElement();
    const items = fixture.items.slice();
    items.splice(2, 1);
    await fixture.setState({
      items,
      selectedIndex: 2,
      selectionRequired: true
    });
    fixture.render();
    assert.equal(fixture.state.selectedIndex, 1);
  });

  it("drops selection when the last item is removed", async () => {
    const fixture = createSampleElement();
    await fixture.setState({
      items: [],
      selectedIndex: 0,
      selectionRequired: true
    });
    fixture.render();
    assert.equal(fixture.state.selectedIndex, -1);
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

  it("changing selection through (simulated) user interaction raises the selected-index-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('selected-index-changed', () => {
      done();
    });
    container.appendChild(fixture);

    fixture[symbols.raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectedIndex = 1;
    fixture[symbols.raiseChangeEvents] = false;
  });

  it("changing selection programmatically does not raise the selected-index-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener('selected-index-changed', () => {
      assert.fail(null, null, 'selected-index-changed event should not have been raised in response to programmatic property change');
    });
    container.appendChild(fixture);
    fixture.selectedIndex = 1; // This should not trigger events.
    // Give event handler a chance to run (but it shouldn't).
    setTimeout(done);
  });

  it("adds selected calculation to itemCalcs", () => {
    const fixture = createSampleElement();
    const items = fixture.items;

    // Start of list
    fixture.selectFirst();
    assert(fixture.itemCalcs(items[0], 0).selected);
    assert(!fixture.itemCalcs(items[1], 1).selected);
    assert(!fixture.itemCalcs(items[2], 2).selected);

    // End of list
    fixture.selectLast();
    assert(!fixture.itemCalcs(items[0], 0).selected);
    assert(!fixture.itemCalcs(items[1], 1).selected);
    assert(fixture.itemCalcs(items[2], 2).selected);
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
