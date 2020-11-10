import { defaultState, setState, state } from "../../src/base/internal.js";
import ItemsMultiSelectMixin from "../../src/base/ItemsMultiSelectMixin.js";
import MultiSelectValueAPIMixin from "../../src/base/MultiSelectValueAPIMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

/* Element that exposes a value property */
class MultiSelectValueAPITest extends ItemsMultiSelectMixin(
  ReactiveMixin(MultiSelectValueAPIMixin(HTMLElement))
) {
  // @ts-ignore
  get [defaultState]() {
    const items = ["Zero", "One", "Two"].map((string) => {
      const item = document.createElement("div");
      item.textContent = string;
      item.setAttribute("value", string.toLowerCase());
      return item;
    });
    return Object.assign(super[defaultState], {
      items,
    });
  }
}
customElements.define("multi-select-value-api-test", MultiSelectValueAPITest);

describe("MultiSelectValueAPITest", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("returns the empty string as the value for no selection", () => {
    const fixture = new MultiSelectValueAPITest();
    assert.equal(fixture.value, "");
  });

  it("returns a single value when a single item is selected", () => {
    const fixture = new MultiSelectValueAPITest();
    fixture[setState]({ selectedItemFlags: [true, false, false] });
    assert.equal(fixture.value, "zero");
  });

  it("returns a return-delimited value when multiple items are selected", () => {
    const fixture = new MultiSelectValueAPITest();
    fixture[setState]({ selectedItemFlags: [true, false, true] });
    assert.equal(fixture.value, "zero\ntwo");
  });

  it("can select the items with the indicated values", () => {
    const fixture = new MultiSelectValueAPITest();
    fixture.value = "one\ntwo";
    assert.deepEqual(fixture[state].selectedItemFlags, [false, true, true]);
  });

  it("ignores values that aren't found", () => {
    const fixture = new MultiSelectValueAPITest();
    fixture.value = "one\nfoo\ntwo";
    assert.deepEqual(fixture[state].selectedItemFlags, [false, true, true]);
    assert.equal(fixture[state].value, "one\ntwo");
  });
});
