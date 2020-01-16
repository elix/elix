import { assert } from '../test-helpers.js';
import SingleSelectionMixin from "../../src/SingleSelectionMixin.js";
import SelectedItemTextValueMixin from "../../src/SelectedItemTextValueMixin.js";

/* Element that exposes a value property */
class ElementWithValue extends SelectedItemTextValueMixin(
  SingleSelectionMixin(HTMLElement)
) {
  get items() {
    if (!this._items) {
      const strings = ["One", "Two", "Three"];
      this._items = strings.map(string => {
        const item = document.createElement("div");
        item.textContent = string;
        return item;
      });
    }
    return this._items;
  }
}
customElements.define("element-with-value", ElementWithValue);

describe("SelectedItemTextValueMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("returns the empty string for no selection", () => {
    const fixture = new ElementWithValue();
    assert.equal(fixture.selectedItem, null);
    assert.equal(fixture.value, "");
  });

  it("returns the text of the selected item", () => {
    const fixture = new ElementWithValue();
    fixture.selectedIndex = 0;
    assert.equal(fixture.value, "One");
  });

  it("can set the selectedItem that has the indicated text", () => {
    const fixture = new ElementWithValue();
    fixture.value = "Two";
    assert.equal(fixture.selectedIndex, 1);
  });

  it("sets selectedItem to null if indicated text isn't found", () => {
    const fixture = new ElementWithValue();
    fixture.selectedIndex = 0;
    fixture.value = "foo";
    assert.equal(fixture.selectedItem, null);
  });
});
