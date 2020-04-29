import * as internal from "../../src/base/internal.js";
import ItemCursorMixin from "../../src/base/ItemCursorMixin.js";
import MultiSelectionMixin from "../../src/base/MultiSelectionMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";

class MultiSelectionTest extends ItemCursorMixin(
  MultiSelectionMixin(ReactiveMixin(HTMLElement))
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
customElements.define("multi-selection-test", MultiSelectionTest);

describe("MultiSelectionMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  // it("has selectedIndices initially all false", () => {
  //   const fixture = new MultiSelectionTest();
  //   assert.deepEqual(fixture.selectedIndices, [false, false, false]);
  // });
});
