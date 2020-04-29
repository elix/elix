import { defaultState, state } from "../../src/base/internal.js";
import ItemsMultiSelectMixin from "../../src/base/ItemsMultiSelectMixin.js";
import MultiSelectAPIMixin from "../../src/base/MultiSelectAPIMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class MultiSelectAPITest extends ItemsMultiSelectMixin(
  MultiSelectAPIMixin(ReactiveMixin(HTMLElement))
) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      items: ["Zero", "One", "Two"],
    });
  }

  get items() {
    const { items } = /** @type {any} */ (this[state]);
    return items;
  }
}
customElements.define("multi-select-api-test", MultiSelectAPITest);

describe("MultiSelectAPIMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("lets the selectedItems be set as an array", () => {
    const fixture = new MultiSelectAPITest();
    const items = fixture.items;
    fixture.selectedItems = [items[0], items[2]];
    assert.deepEqual(fixture.selectedFlags, [true, false, true]);
  });

  it("can toggle selected state of an individual items", () => {
    const fixture = new MultiSelectAPITest();
    assert(!fixture.selectedFlags[0]);
    fixture.toggleSelectedFlag(0);
    assert(fixture.selectedFlags[0]);
    fixture.toggleSelectedFlag(0, true);
    assert(fixture.selectedFlags[0]);
    fixture.toggleSelectedFlag(0, false);
    assert(!fixture.selectedFlags[0]);
  });
});
