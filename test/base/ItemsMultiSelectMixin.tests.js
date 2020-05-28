import { defaultState, setState, state } from "../../src/base/internal.js";
import ItemsCursorMixin from "../../src/base/ItemsCursorMixin.js";
import ItemsMultiSelectMixin from "../../src/base/ItemsMultiSelectMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class MultiSelectionTest extends ItemsCursorMixin(
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
    assert.deepEqual(fixture[state].selectedItemFlags, [false, false, false]);
  });

  it("ensures selectedItemFlags is same length as items", () => {
    const fixture = new MultiSelectionTest();
    fixture[setState]({
      selectedItemFlags: [true], // Too short
    });
    assert.deepEqual(fixture[state].selectedItemFlags, [true, false, false]);
    fixture[setState]({
      selectedItemFlags: [false, true, false, true], // Too long
    });
    assert.deepEqual(fixture[state].selectedItemFlags, [false, true, false]);
  });

  it("refreshes selectedItemFlags when items change", () => {
    const fixture = new MultiSelectionTest();
    fixture[setState]({
      selectedItemFlags: [true, false, true],
    });
    fixture[setState]({
      items: ["a", "Zero", "b", "c", "Two", "d"],
    });
    assert.deepEqual(fixture[state].selectedItemFlags, [
      false,
      true,
      false,
      false,
      true,
      false,
    ]);
  });
});
