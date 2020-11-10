import {
  defaultState,
  raiseChangeEvents,
  state,
} from "../../src/base/internal.js";
import ItemsMultiSelectMixin from "../../src/base/ItemsMultiSelectMixin.js";
import MultiSelectAPIMixin from "../../src/base/MultiSelectAPIMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class MultiSelectAPITest extends ItemsMultiSelectMixin(
  MultiSelectAPIMixin(ReactiveMixin(HTMLElement))
) {
  // @ts-ignore
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
    assert.deepEqual(fixture.selectedItemFlags, [true, false, true]);
  });

  it("can toggle selected state of an individual items", () => {
    const fixture = new MultiSelectAPITest();
    assert(!fixture.selectedItemFlags[0]);
    fixture.toggleSelectedFlag(0);
    assert(fixture.selectedItemFlags[0]);
    fixture.toggleSelectedFlag(0, true);
    assert(fixture.selectedItemFlags[0]);
    fixture.toggleSelectedFlag(0, false);
    assert(!fixture.selectedItemFlags[0]);
  });

  it("raises the selecteditemflagschange event when selection changes", async () => {
    const fixture = new MultiSelectAPITest();
    container.append(fixture);
    await new Promise((resolve) => {
      fixture.addEventListener("selecteditemflagschange", () => {
        resolve();
      });
      // Simulate user interaction.
      fixture[raiseChangeEvents] = true;
      fixture.selectedItemFlags = [true, false, true];
    });
  });
});
