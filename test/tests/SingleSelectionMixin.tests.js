import { assert } from '../test-helpers.js';
import * as internal from "../../src/internal.js";
import ReactiveMixin from "../../src/ReactiveMixin.js";
import SingleSelectionMixin from "../../src/SingleSelectionMixin.js";

class SingleSelectionTest extends SingleSelectionMixin(
  ReactiveMixin(HTMLElement)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      items: []
    });
  }

  get items() {
    return this[internal.state].items;
  }
}
customElements.define("single-selection-test", SingleSelectionTest);

describe("SingleSelectionMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("has selectedIndex initially -1", () => {
    const fixture = new SingleSelectionTest();
    assert.equal(fixture[internal.state].selectedIndex, -1);
  });

  it("can advance the selection to the next item", async () => {
    const fixture = createSampleElement();
    assert.equal(fixture[internal.state].selectedIndex, -1);
    const selectionChanged0 = fixture.selectNext();
    assert.equal(fixture[internal.state].selectedIndex, 0);
    assert(selectionChanged0);
    fixture.selectNext();
    const selectionChanged1 = fixture.selectNext();
    assert.equal(fixture[internal.state].selectedIndex, 2);
    assert(selectionChanged1);
    // Moving past last item should have no effect.
    const selectionChanged2 = fixture.selectNext();
    assert.equal(fixture[internal.state].selectedIndex, 2);
    assert(!selectionChanged2);
    await Promise.resolve();
  });

  it("can move the selection to the previous item", async () => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.selectPrevious();
    assert.equal(fixture[internal.state].selectedIndex, 2); // last item
    fixture.selectPrevious();
    assert.equal(fixture[internal.state].selectedIndex, 1);
    await Promise.resolve();
  });

  it("can wrap the selection from the last to the first item", async () => {
    const fixture = createSampleElement();
    fixture.selectionWraps = true;
    fixture[internal.setState]({ selectedIndex: 2 });
    fixture.selectNext();
    assert.equal(fixture[internal.state].selectedIndex, 0);
    await Promise.resolve();
  });

  it("can wrap the selection from the first to the last item", async () => {
    const fixture = createSampleElement();
    fixture.selectionWraps = true;
    fixture[internal.setState]({ selectedIndex: 0 });
    fixture.selectPrevious();
    assert.equal(fixture[internal.state].selectedIndex, 2);
    await Promise.resolve();
  });

  it("selects first item when selection is required and no item is currently selected", async () => {
    const fixture = createSampleElement();
    assert.equal(fixture[internal.state].selectedIndex, -1);
    await fixture[internal.setState]({
      selectionRequired: true
    });
    assert.equal(fixture[internal.state].selectedIndex, 0);
  });

  it("preserves selected item when items change and old selection exists in new set", async () => {
    const fixture = createSampleElement();
    fixture[internal.setState]({
      selectedIndex: 1
    });
    assert.equal(fixture[internal.state].selectedIndex, 1);
    fixture[internal.setState]({
      items: fixture[internal.state].items.slice(1) // Removes item 0
    });
    assert.equal(fixture[internal.state].selectedIndex, 0);
  });

  it("selects nearest item when item in last place is removed", async () => {
    const fixture = createSampleElement();
    const items = fixture.items.slice();
    items.splice(2, 1);
    await fixture[internal.setState]({
      items,
      selectedIndex: 2
    });
    assert.equal(fixture[internal.state].selectedIndex, 1);
  });

  it("drops selection when the last item is removed", async () => {
    const fixture = createSampleElement();
    await fixture[internal.setState]({
      items: [],
      selectedIndex: 0
    });
    assert.equal(fixture.selectedIndex, -1);
  });

  it("sets canSelectNext/canSelectPrevious with no wrapping", async () => {
    const fixture = createSampleElement();
    assert(!fixture.selectionWraps);

    // No selection yet
    assert.equal(fixture[internal.state].selectedIndex, -1);
    assert(fixture[internal.state].canSelectNext);
    assert(fixture[internal.state].canSelectPrevious);

    // Start of list
    fixture.selectFirst();
    assert(fixture[internal.state].canSelectNext);
    assert(!fixture[internal.state].canSelectPrevious);

    // Middle of list
    fixture.selectNext();
    assert(fixture[internal.state].canSelectNext);
    assert(fixture[internal.state].canSelectPrevious);

    // End of list
    fixture.selectLast();
    assert(!fixture[internal.state].canSelectNext);
    assert(fixture[internal.state].canSelectPrevious);

    await Promise.resolve();
  });

  it("sets canSelectNext/canSelectPrevious with wrapping", async () => {
    const fixture = createSampleElement();
    fixture.selectionWraps = true;

    // Start of list
    fixture.selectFirst();
    assert(fixture[internal.state].canSelectNext);
    assert(fixture[internal.state].canSelectPrevious);

    // End of list
    fixture.selectLast();
    assert(fixture[internal.state].canSelectNext);
    assert(fixture[internal.state].canSelectPrevious);

    await Promise.resolve();
  });

  it("changing selection through (simulated) user interaction raises the selected-index-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener("selected-index-changed", () => {
      done();
    });
    container.appendChild(fixture);

    fixture[internal.raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectedIndex = 1;
    fixture[internal.raiseChangeEvents] = false;
  });

  it("changing selection programmatically does not raise the selected-index-changed event", done => {
    const fixture = createSampleElement();
    fixture.addEventListener("selected-index-changed", () => {
      assert.fail(
        null,
        null,
        "selected-index-changed event should not have been raised in response to programmatic property change"
      );
    });
    container.appendChild(fixture);
    fixture.selectedIndex = 1; // This should not trigger events.
    // Give event handler a chance to run (but it shouldn't).
    setTimeout(done);
  });

  it("ignores a selectedIndex that's not a number", () => {
    const fixture = createSampleElement();
    // @ts-ignore
    fixture.selectedIndex = "foo";
    assert.equal(fixture.selectedIndex, -1);
  });
});

/**
 * @returns {SingleSelectionTest}
 */
function createSampleElement() {
  const fixture = new SingleSelectionTest();
  // To keep this unit test collection focus on selection, and not on tracking
  // children as items, we just use a plain array of item objects instead.
  fixture[internal.setState]({
    items: ["Zero", "One", "Two"]
  });
  return fixture;
}
