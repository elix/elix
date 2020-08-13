import { defaultState, setState, state } from "../../src/base/internal.js";
import ItemsCursorMixin from "../../src/base/ItemsCursorMixin.js";
import SelectedValueAPIMixin from "../../src/base/SelectedValueAPIMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

/* Element that exposes a value property */
class SelectedTextAPITest extends ReactiveMixin(
  SelectedValueAPIMixin(ItemsCursorMixin(HTMLElement))
) {
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
customElements.define("selected-value-api-test", SelectedTextAPITest);

describe("SelectedValueAPIMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("returns the empty string as the value for no selection", () => {
    const fixture = new SelectedTextAPITest();
    assert.equal(fixture[state].selectedIndex, -1);
    assert.equal(fixture.value, "");
  });

  it("returns the value of the selected item", () => {
    const fixture = new SelectedTextAPITest();
    fixture[setState]({ selectedIndex: 0 });
    assert.equal(fixture.value, "zero");
  });

  it("can set the selected index of the item with the indicated value", () => {
    const fixture = new SelectedTextAPITest();
    fixture.value = "one";
    assert.equal(fixture[state].selectedIndex, 1);
  });

  it("clears the selected index if indicated text isn't found", () => {
    const fixture = new SelectedTextAPITest();
    fixture.value = "foo";
    assert.equal(fixture[state].selectedIndex, -1);
  });
});
