import CursorAPIMixin from "../../src/base/CursorAPIMixin.js";
import {
  defaultState,
  raiseChangeEvents,
  setState,
  state,
} from "../../src/base/internal.js";
import ItemsCursorMixin from "../../src/base/ItemsCursorMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class CursorAPITest extends ItemsCursorMixin(
  CursorAPIMixin(ReactiveMixin(HTMLElement))
) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      items: ["Zero", "One", "Two"],
    });
  }

  get items() {
    return this[state].items;
  }
  set items(items) {
    this[setState]({ items });
  }
}
customElements.define("cursor-api-test", CursorAPITest);

describe("CursorAPIMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("has currentIndex initially -1", () => {
    const fixture = new CursorAPITest();
    assert.equal(fixture.currentIndex, -1);
  });

  it("can move to the next item", () => {
    const fixture = new CursorAPITest();
    assert.equal(fixture.currentIndex, -1);
    const selectionChanged0 = fixture.goNext();
    assert.equal(fixture.currentIndex, 0);
    assert(selectionChanged0);
    fixture.goNext();
    const selectionChanged1 = fixture.goNext();
    assert.equal(fixture.currentIndex, 2);
    assert(selectionChanged1);
    // Moving past last item should have no effect.
    const selectionChanged2 = fixture.goNext();
    assert.equal(fixture.currentIndex, 2);
    assert(!selectionChanged2);
  });

  it("can move to the previous item", () => {
    const fixture = new CursorAPITest();
    container.append(fixture);
    fixture.goPrevious();
    assert.equal(fixture.currentIndex, 2); // last item
    fixture.goPrevious();
    assert.equal(fixture.currentIndex, 1);
  });

  it("can wrap from the last to the first item", () => {
    const fixture = new CursorAPITest();
    fixture.cursorOperationsWrap = true;
    fixture[setState]({ currentIndex: 2 });
    fixture.goNext();
    assert.equal(fixture.currentIndex, 0);
  });

  it("can wrap from the first to the last item", () => {
    const fixture = new CursorAPITest();
    fixture.cursorOperationsWrap = true;
    fixture[setState]({ currentIndex: 0 });
    fixture.goPrevious();
    assert.equal(fixture.currentIndex, 2);
  });

  it("moves to first item when current item is required and no item is current", () => {
    const fixture = new CursorAPITest();
    assert.equal(fixture.currentIndex, -1);
    fixture.currentItemRequired = true;
    assert.equal(fixture.currentIndex, 0);
  });

  it("changing currentIndex through (simulated) user interaction raises the current-index-changed event", (done) => {
    const fixture = new CursorAPITest();
    fixture.addEventListener("current-index-changed", () => {
      done();
    });
    container.append(fixture);

    fixture[raiseChangeEvents] = true; // Simulate user interaction
    fixture.currentIndex = 1;
    fixture[raiseChangeEvents] = false;
  });

  it("changing currentIndex programmatically does not raise the current-index-changed event", (done) => {
    const fixture = new CursorAPITest();
    fixture.addEventListener("current-index-changed", () => {
      assert.fail(
        null,
        null,
        "current-index-changed event should not have been raised in response to programmatic property change"
      );
    });
    container.append(fixture);
    fixture.currentIndex = 1; // This should not trigger events.
    // Give event handler a chance to run (but it shouldn't).
    setTimeout(done);
  });

  it("ignores a currentIndex that's not a number", () => {
    const fixture = new CursorAPITest();
    // @ts-ignore
    fixture.currentIndex = "foo";
    assert.equal(fixture.currentIndex, -1);
  });
});
