import * as internal from "../../src/base/internal.js";
import ItemCursorMixin from "../../src/base/ItemCursorMixin.js";
import MultiSelectionMixin from "../../src/base/MultiSelectionMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class MultiSelectionTest extends ItemCursorMixin(
  MultiSelectionMixin(ReactiveMixin(HTMLElement))
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      items: ["Zero", "One", "Two"],
    });
  }
}
customElements.define("multi-selection-test", MultiSelectionTest);

describe("MultiSelectionMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("has selected flags initially all false", () => {
    const fixture = new MultiSelectionTest();
    assert.deepEqual(fixture.selected, [false, false, false]);
  });

  it("refreshes selected flags when items change", () => {
    const fixture = new MultiSelectionTest();
    fixture[internal.setState]({
      selected: [true, false, true],
    });
    fixture[internal.setState]({
      items: ["a", "Zero", "b", "c", "Two", "d"],
    });
    assert.deepEqual(fixture.selected, [
      false,
      true,
      false,
      false,
      true,
      false,
    ]);
  });

  it("lets the selectedItems be set as an array", () => {
    const fixture = new MultiSelectionTest();
    const items = fixture[internal.state].items;
    fixture.selectedItems = [items[0], items[2]];
    assert.deepEqual(fixture.selected, [true, false, true]);
  });
});
