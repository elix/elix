import { defaultState, setState, state } from "../../src/base/internal.js";
import ItemCursorMixin from "../../src/base/ItemCursorMixin.js";
import ItemsMultiSelectMixin from "../../src/base/ItemsMultiSelectMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class MultiSelectionTest extends ItemCursorMixin(
  ItemsMultiSelectMixin(ReactiveMixin(HTMLElement))
) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      items: ["Zero", "One", "Two"],
    });
  }
}
customElements.define("multi-selection-test", MultiSelectionTest);

describe("ItemsMultiSelectMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("has selected flags initially all false", () => {
    const fixture = new MultiSelectionTest();
    assert.deepEqual(fixture[state].selectedFlags, [false, false, false]);
  });

  it("ensures selectedFlags is same length as items", () => {
    const fixture = new MultiSelectionTest();
    fixture[setState]({
      selectedFlags: [true],
    });
    assert.deepEqual(fixture[state].selectedFlags, [true, false, false]);
  });

  it("refreshes selectedFlags when items change", () => {
    const fixture = new MultiSelectionTest();
    fixture[setState]({
      selectedFlags: [true, false, true],
    });
    fixture[setState]({
      items: ["a", "Zero", "b", "c", "Two", "d"],
    });
    assert.deepEqual(fixture[state].selectedFlags, [
      false,
      true,
      false,
      false,
      true,
      false,
    ]);
  });
});
