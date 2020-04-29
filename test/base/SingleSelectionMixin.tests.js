import * as internal from "../../src/base/internal.js";
import ItemsCursorMixin from "../../src/base/ItemsCursorMixin.js";
import SingleSelectionMixin from "../../src/base/SingleSelectionMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class SingleSelectionTest extends ItemsCursorMixin(
  SingleSelectionMixin(ReactiveMixin(HTMLElement))
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      items: ["Zero", "One", "Two"],
    });
  }

  get items() {
    return this[internal.state].items;
  }
  set items(items) {
    this[internal.setState]({ items });
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
    assert.equal(fixture.selectedIndex, -1);
  });

  it("can advance the selection to the next item", () => {
    const fixture = new SingleSelectionTest();
    assert.equal(fixture.selectedIndex, -1);
    const selectionChanged0 = fixture.selectNext();
    assert.equal(fixture.selectedIndex, 0);
    assert(selectionChanged0);
    fixture.selectNext();
    const selectionChanged1 = fixture.selectNext();
    assert.equal(fixture.selectedIndex, 2);
    assert(selectionChanged1);
    // Moving past last item should have no effect.
    const selectionChanged2 = fixture.selectNext();
    assert.equal(fixture.selectedIndex, 2);
    assert(!selectionChanged2);
  });

  it("can move the selection to the previous item", () => {
    const fixture = new SingleSelectionTest();
    container.appendChild(fixture);
    fixture.selectPrevious();
    assert.equal(fixture.selectedIndex, 2); // last item
    fixture.selectPrevious();
    assert.equal(fixture.selectedIndex, 1);
  });

  it("can wrap the selection from the last to the first item", () => {
    const fixture = new SingleSelectionTest();
    fixture.selectionWraps = true;
    fixture[internal.setState]({ selectedIndex: 2 });
    fixture.selectNext();
    assert.equal(fixture.selectedIndex, 0);
  });

  it("can wrap the selection from the first to the last item", () => {
    const fixture = new SingleSelectionTest();
    fixture.selectionWraps = true;
    fixture[internal.setState]({ selectedIndex: 0 });
    fixture.selectPrevious();
    assert.equal(fixture.selectedIndex, 2);
  });

  it("selects first item when selection is required and no item is currently selected", () => {
    const fixture = new SingleSelectionTest();
    assert.equal(fixture.selectedIndex, -1);
    fixture.selectionRequired = true;
    assert.equal(fixture.selectedIndex, 0);
  });

  it("preserves selected item when items change and old selection exists in new set", () => {
    const fixture = new SingleSelectionTest();
    fixture.selectedIndex = 1;
    assert.equal(fixture.selectedIndex, 1);
    fixture.items = fixture.items.slice(1); // Removes item 0
    assert.equal(fixture.selectedIndex, 0);
  });

  it("selects nearest item when item in last place is removed", () => {
    const fixture = new SingleSelectionTest();
    fixture.selectedIndex = 2;
    const items = fixture.items.slice();
    items.splice(2, 1);
    fixture.items = items;
    assert.equal(fixture.selectedIndex, 1);
  });

  it("drops selection when the last item is removed", () => {
    const fixture = new SingleSelectionTest();
    fixture.selectedIndex = 0;
    fixture.items = [];
    assert.equal(fixture.selectedIndex, -1);
  });

  it("sets canSelectNext/canSelectPrevious with no wrapping", () => {
    const fixture = new SingleSelectionTest();
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
    const fixture = new SingleSelectionTest();
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

  it("changing selection through (simulated) user interaction raises the selected-index-changed event", (done) => {
    const fixture = new SingleSelectionTest();
    fixture.addEventListener("selected-index-changed", () => {
      done();
    });
    container.appendChild(fixture);

    fixture[internal.raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectedIndex = 1;
    fixture[internal.raiseChangeEvents] = false;
  });

  it("changing selection programmatically does not raise the selected-index-changed event", (done) => {
    const fixture = new SingleSelectionTest();
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
    const fixture = new SingleSelectionTest();
    // @ts-ignore
    fixture.selectedIndex = "foo";
    assert.equal(fixture.selectedIndex, -1);
  });
});
