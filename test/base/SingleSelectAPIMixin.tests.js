import CursorSelectMixin from "../../src/base/CursorSelectMixin.js";
import {
  defaultState,
  raiseChangeEvents,
  setState,
  state,
} from "../../src/base/internal.js";
import ItemsCursorMixin from "../../src/base/ItemsCursorMixin.js";
import SingleSelectAPIMixin from "../../src/base/SingleSelectAPIMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class SingleSelectAPITest extends CursorSelectMixin(
  ItemsCursorMixin(SingleSelectAPIMixin(ReactiveMixin(HTMLElement)))
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
customElements.define("single-select-api-test", SingleSelectAPITest);

describe("SingleSelectAPIMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("has selectedIndex initially -1", () => {
    const fixture = new SingleSelectAPITest();
    assert.equal(fixture.selectedIndex, -1);
  });

  it("changing selection through (simulated) user interaction raises the selected-index-changed event", (done) => {
    const fixture = new SingleSelectAPITest();
    fixture.addEventListener("selected-index-changed", () => {
      done();
    });
    container.append(fixture);

    fixture[raiseChangeEvents] = true; // Simulate user interaction
    fixture.selectedIndex = 1;
    fixture[raiseChangeEvents] = false;
  });

  it("changing selection programmatically does not raise the selected-index-changed event", (done) => {
    const fixture = new SingleSelectAPITest();
    fixture.addEventListener("selected-index-changed", () => {
      assert.fail(
        null,
        null,
        "selected-index-changed event should not have been raised in response to programmatic property change"
      );
    });
    container.append(fixture);
    fixture.selectedIndex = 1; // This should not trigger events.
    // Give event handler a chance to run (but it shouldn't).
    setTimeout(done);
  });

  it("ignores a selectedIndex that's not a number", () => {
    const fixture = new SingleSelectAPITest();
    // @ts-ignore
    fixture.selectedIndex = "foo";
    assert.equal(fixture.selectedIndex, -1);
  });
});
