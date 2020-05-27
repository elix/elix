import { defaultState, setState, state } from "../../src/base/internal.js";
import ItemsCursorMixin from "../../src/base/ItemsCursorMixin.js";
import SelectedTextAPIMixin from "../../src/base/SelectedTextAPIMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

/* Element that exposes a selectedText property */
class SelectedTextAPITest extends ReactiveMixin(
  SelectedTextAPIMixin(ItemsCursorMixin(HTMLElement))
) {
  get [defaultState]() {
    const items = ["One", "Two", "Three"].map((string) => {
      const item = document.createElement("div");
      item.textContent = string;
      return item;
    });
    return Object.assign(super[defaultState], {
      items,
    });
  }
}
customElements.define("selected-item-api-test", SelectedTextAPITest);

describe("SelectedTextAPIMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("returns the empty string as the selectedText for no selection", () => {
    const fixture = new SelectedTextAPITest();
    assert.equal(fixture[state].selectedIndex, undefined);
    assert.equal(fixture.selectedText, "");
  });

  it("returns the text of the selected item", () => {
    const fixture = new SelectedTextAPITest();
    fixture[setState]({ selectedIndex: 0 });
    assert.equal(fixture.selectedText, "One");
  });

  it("can set the selectedItem that has the indicated text", () => {
    const fixture = new SelectedTextAPITest();
    fixture.selectedText = "Two";
    assert.equal(fixture[state].selectedIndex, 1);
  });

  it("sets selectedItem to null if indicated text isn't found", () => {
    const fixture = new SelectedTextAPITest();
    fixture.selectedText = "foo";
    assert.equal(fixture[state].selectedIndex, -1);
  });
});
