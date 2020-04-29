import { defaultState, setState, state } from "../../src/base/internal.js";
import ItemCursorMixin from "../../src/base/ItemCursorMixin.js";
import MultiSelectionMixin from "../../src/base/MultiSelectionMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class MultiSelectionTest extends ItemCursorMixin(
  MultiSelectionMixin(ReactiveMixin(HTMLElement))
) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
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
    assert.deepEqual(fixture.selectedFlags, [false, false, false]);
  });

  it("refreshes selectedFlags when items change", () => {
    const fixture = new MultiSelectionTest();
    fixture[setState]({
      selectedFlags: [true, false, true],
    });
    fixture[setState]({
      items: ["a", "Zero", "b", "c", "Two", "d"],
    });
    assert.deepEqual(fixture.selectedFlags, [
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
    const items = fixture[state].items;
    fixture.selectedItems = [items[0], items[2]];
    assert.deepEqual(fixture.selectedFlags, [true, false, true]);
  });

  it("can toggle selected state of an individual items", () => {
    const fixture = new MultiSelectionTest();
    assert(!fixture.selectedFlags[0]);
    fixture.toggleSelectedFlag(0);
    assert(fixture.selectedFlags[0]);
    fixture.toggleSelectedFlag(0, true);
    assert(fixture.selectedFlags[0]);
    fixture.toggleSelectedFlag(0, false);
    assert(!fixture.selectedFlags[0]);
  });
});
