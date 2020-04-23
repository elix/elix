import * as internal from "../../src/base/internal.js";
import ItemCursorMixin from "../../src/base/ItemCursorMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class ItemCursorTest extends ItemCursorMixin(ReactiveMixin(HTMLElement)) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      items: ["Zero", "One", "Two"],
    });
  }

  get items() {
    return this[internal.state].items;
  }
}
customElements.define("current-item-test", ItemCursorTest);

describe("ItemCursorMixin", () => {
  it("has currentIndex initially -1", () => {
    const fixture = new ItemCursorTest();
    assert.equal(fixture[internal.state].currentIndex, -1);
  });

  it("can move to the next item", () => {
    const fixture = new ItemCursorTest();
    assert.equal(fixture[internal.state].currentIndex, -1);
    const changed0 = fixture[internal.goNext]();
    assert.equal(fixture[internal.state].currentIndex, 0);
    assert(changed0);
    fixture[internal.goNext]();
    const change1 = fixture[internal.goNext]();
    assert.equal(fixture[internal.state].currentIndex, 2);
    assert(change1);
    // Moving past last item should have no effect.
    const changed2 = fixture[internal.goNext]();
    assert.equal(fixture[internal.state].currentIndex, 2);
    assert(!changed2);
  });

  it("can move to the previous item", () => {
    const fixture = new ItemCursorTest();
    const changed0 = fixture[internal.goPrevious]();
    assert.equal(fixture[internal.state].currentIndex, 2); // last item
    assert(changed0);
    fixture[internal.goPrevious]();
    const changed1 = fixture[internal.goPrevious]();
    assert.equal(fixture[internal.state].currentIndex, 0);
    assert(changed1);
    const changed2 = fixture[internal.goPrevious]();
    assert.equal(fixture[internal.state].currentIndex, 0);
    assert(!changed2);
  });

  it("can wrap from the last to the first item", () => {
    const fixture = new ItemCursorTest();
    fixture[internal.setState]({
      cursorOperationsWrap: true,
      currentIndex: 2,
    });
    fixture[internal.goNext]();
    assert.equal(fixture[internal.state].currentIndex, 0);
  });

  it("can wrap from the first to the last item", () => {
    const fixture = new ItemCursorTest();
    fixture[internal.setState]({
      cursorOperationsWrap: true,
      currentIndex: 0,
    });
    fixture[internal.goPrevious]();
    assert.equal(fixture[internal.state].currentIndex, 2);
  });

  it("makes first item when current item is required and no item is curren", () => {
    const fixture = new ItemCursorTest();
    assert.equal(fixture[internal.state].currentIndex, -1);
    fixture[internal.setState]({ currentItemRequired: true });
    assert.equal(fixture[internal.state].currentIndex, 0);
  });

  it("preserves the current item when items change and old item exists in new set", () => {
    const fixture = new ItemCursorTest();
    fixture[internal.setState]({ currentIndex: 1 });
    assert.equal(fixture[internal.state].currentIndex, 1);
    fixture[internal.setState]({
      items: fixture[internal.state].items.slice(1), // Removes item 0
    });
    assert.equal(fixture[internal.state].currentIndex, 0);
  });

  it("clamps current index to fall within item bounds", () => {
    const fixture = new ItemCursorTest();
    fixture[internal.setState]({ currentIndex: -2 });
    // -1 (no selection) is lowest possible value.
    assert.equal(fixture[internal.state].currentIndex, -1);
    // We have 3 items, so 2 is highest possible value.
    fixture[internal.setState]({ currentIndex: 3 });
    assert.equal(fixture[internal.state].currentIndex, 2);
  });

  it("makes nearest item current when item in last place is removed", () => {
    const fixture = new ItemCursorTest();
    fixture[internal.setState]({
      items: ["Zero", "One"],
      currentIndex: 2,
    });
    assert.equal(fixture[internal.state].currentIndex, 1);
  });

  it("drops selection when the last item is removed", () => {
    const fixture = new ItemCursorTest();
    fixture[internal.setState]({
      items: [],
      currentIndex: 0,
    });
    assert.equal(fixture[internal.state].currentIndex, -1);
  });

  it("sets canGoNext/canGoPrevious with no wrapping", () => {
    const fixture = new ItemCursorTest();
    assert(!fixture[internal.state].cursorOperationsWrap);

    // No current item yet
    assert.equal(fixture[internal.state].currentIndex, -1);
    assert(fixture[internal.state].canGoNext);
    assert(fixture[internal.state].canGoPrevious);

    // Start of list
    fixture[internal.goFirst]();
    assert(fixture[internal.state].canGoNext);
    assert(!fixture[internal.state].canGoPrevious);

    // Middle of list
    fixture[internal.goNext]();
    assert(fixture[internal.state].canGoNext);
    assert(fixture[internal.state].canGoPrevious);

    // End of list
    fixture[internal.goLast]();
    assert(!fixture[internal.state].canGoNext);
    assert(fixture[internal.state].canGoPrevious);
  });

  it("sets canGoNext/canGoPrevious with wrapping", () => {
    const fixture = new ItemCursorTest();
    fixture[internal.setState]({ cursorOperationsWrap: true });

    // Start of list
    fixture[internal.goFirst]();
    assert(fixture[internal.state].canGoNext);
    assert(fixture[internal.state].canGoPrevious);

    // End of list
    fixture[internal.goLast]();
    assert(fixture[internal.state].canGoNext);
    assert(fixture[internal.state].canGoPrevious);
  });
});
