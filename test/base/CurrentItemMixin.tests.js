import CurrentItemMixin from "../../src/base/CurrentItemMixin.js";
import * as internal from "../../src/base/internal.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class CurrentItemTest extends CurrentItemMixin(ReactiveMixin(HTMLElement)) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      items: ["Zero", "One", "Two"],
    });
  }

  get items() {
    return this[internal.state].items;
  }
}
customElements.define("current-item-test", CurrentItemTest);

describe("CurrentItemMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("has currentIndex initially -1", () => {
    const fixture = new CurrentItemTest();
    assert.equal(fixture[internal.state].currentIndex, -1);
  });

  // it("can advance the selection to the next item", async () => {
  //   const fixture = new CurrentItemTest();
  //   assert.equal(fixture[internal.state].selectedIndex, -1);
  //   const selectionChanged0 = fixture.selectNext();
  //   assert.equal(fixture[internal.state].selectedIndex, 0);
  //   assert(selectionChanged0);
  //   fixture.selectNext();
  //   const selectionChanged1 = fixture.selectNext();
  //   assert.equal(fixture[internal.state].selectedIndex, 2);
  //   assert(selectionChanged1);
  //   // Moving past last item should have no effect.
  //   const selectionChanged2 = fixture.selectNext();
  //   assert.equal(fixture[internal.state].selectedIndex, 2);
  //   assert(!selectionChanged2);
  //   await Promise.resolve();
  // });

  // it("can move the selection to the previous item", async () => {
  //   const fixture = new CurrentItemTest();
  //   container.appendChild(fixture);
  //   fixture.selectPrevious();
  //   assert.equal(fixture[internal.state].selectedIndex, 2); // last item
  //   fixture.selectPrevious();
  //   assert.equal(fixture[internal.state].selectedIndex, 1);
  //   await Promise.resolve();
  // });

  // it("can wrap the selection from the last to the first item", async () => {
  //   const fixture = new CurrentItemTest();
  //   fixture.selectionWraps = true;
  //   fixture[internal.setState]({ selectedIndex: 2 });
  //   fixture.selectNext();
  //   assert.equal(fixture[internal.state].selectedIndex, 0);
  //   await Promise.resolve();
  // });

  // it("can wrap the selection from the first to the last item", async () => {
  //   const fixture = new CurrentItemTest();
  //   fixture.selectionWraps = true;
  //   fixture[internal.setState]({ selectedIndex: 0 });
  //   fixture.selectPrevious();
  //   assert.equal(fixture[internal.state].selectedIndex, 2);
  //   await Promise.resolve();
  // });

  it("makes first item when current item is required and no item is curren", () => {
    const fixture = new CurrentItemTest();
    assert.equal(fixture[internal.state].currentIndex, -1);
    fixture[internal.setState]({ currentItemRequired: true });
    assert.equal(fixture[internal.state].currentIndex, 0);
  });

  it("preserves the current item when items change and old item exists in new set", () => {
    const fixture = new CurrentItemTest();
    fixture[internal.setState]({ currentIndex: 1 });
    assert.equal(fixture[internal.state].currentIndex, 1);
    fixture[internal.setState]({
      items: fixture[internal.state].items.slice(1), // Removes item 0
    });
    assert.equal(fixture[internal.state].currentIndex, 0);
  });

  it("clamps current index to fall within item bounds", () => {
    const fixture = new CurrentItemTest();
    fixture[internal.setState]({ currentIndex: -2 });
    // -1 (no selection) is lowest possible value.
    assert.equal(fixture[internal.state].currentIndex, -1);
    // We have 3 items, so 2 is highest possible value.
    fixture[internal.setState]({ currentIndex: 3 });
    assert.equal(fixture[internal.state].currentIndex, 2);
  });

  it("makes nearest item current when item in last place is removed", () => {
    const fixture = new CurrentItemTest();
    fixture[internal.setState]({
      items: ["Zero", "One"],
      currentIndex: 2,
    });
    assert.equal(fixture[internal.state].currentIndex, 1);
  });

  it("drops selection when the last item is removed", () => {
    const fixture = new CurrentItemTest();
    fixture[internal.setState]({
      items: [],
      currentIndex: 0,
    });
    assert.equal(fixture[internal.state].currentIndex, -1);
  });

  // it("sets canSelectNext/canSelectPrevious with no wrapping", async () => {
  //   const fixture = new CurrentItemTest();
  //   assert(!fixture.selectionWraps);

  //   // No selection yet
  //   assert.equal(fixture[internal.state].selectedIndex, -1);
  //   assert(fixture[internal.state].canSelectNext);
  //   assert(fixture[internal.state].canSelectPrevious);

  //   // Start of list
  //   fixture.selectFirst();
  //   assert(fixture[internal.state].canSelectNext);
  //   assert(!fixture[internal.state].canSelectPrevious);

  //   // Middle of list
  //   fixture.selectNext();
  //   assert(fixture[internal.state].canSelectNext);
  //   assert(fixture[internal.state].canSelectPrevious);

  //   // End of list
  //   fixture.selectLast();
  //   assert(!fixture[internal.state].canSelectNext);
  //   assert(fixture[internal.state].canSelectPrevious);

  //   await Promise.resolve();
  // });

  // it("sets canSelectNext/canSelectPrevious with wrapping", async () => {
  //   const fixture = new CurrentItemTest();
  //   fixture.selectionWraps = true;

  //   // Start of list
  //   fixture.selectFirst();
  //   assert(fixture[internal.state].canSelectNext);
  //   assert(fixture[internal.state].canSelectPrevious);

  //   // End of list
  //   fixture.selectLast();
  //   assert(fixture[internal.state].canSelectNext);
  //   assert(fixture[internal.state].canSelectPrevious);

  //   await Promise.resolve();
  // });

  // it("changing selection through (simulated) user interaction raises the selected-index-changed event", (done) => {
  //   const fixture = new CurrentItemTest();
  //   fixture.addEventListener("selected-index-changed", () => {
  //     done();
  //   });
  //   container.appendChild(fixture);

  //   fixture[internal.raiseChangeEvents] = true; // Simulate user interaction
  //   fixture.selectedIndex = 1;
  //   fixture[internal.raiseChangeEvents] = false;
  // });

  // it("changing selection programmatically does not raise the selected-index-changed event", (done) => {
  //   const fixture = new CurrentItemTest();
  //   fixture.addEventListener("selected-index-changed", () => {
  //     assert.fail(
  //       null,
  //       null,
  //       "selected-index-changed event should not have been raised in response to programmatic property change"
  //     );
  //   });
  //   container.appendChild(fixture);
  //   fixture.selectedIndex = 1; // This should not trigger events.
  //   // Give event handler a chance to run (but it shouldn't).
  //   setTimeout(done);
  // });

  // it("ignores a selectedIndex that's not a number", () => {
  //   const fixture = new CurrentItemTest();
  //   // @ts-ignore
  //   fixture.selectedIndex = "foo";
  //   assert.equal(fixture.selectedIndex, -1);
  // });
});
