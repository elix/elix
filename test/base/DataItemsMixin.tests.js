import DataItemsMixin from "../../src/base/DataItemsMixin.js";
import { setState, state } from "../../src/base/internal.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class DataItemsTest extends DataItemsMixin(ReactiveMixin(HTMLElement)) {}
customElements.define("data-items-test", DataItemsTest);

describe("DataItemsMixin", () => {
  it("creates items for each data entry", () => {
    const fixture = new DataItemsTest();
    fixture[setState]({
      data: ["Zero", "One", "Two"],
    });
    const { items } = fixture[state];
    assert.equal(items.length, 3);
    assert.equal(items[0].localName, "div");
    assert.equal(items[0].textContent, "Zero");
    assert.equal(items[1].localName, "div");
    assert.equal(items[1].textContent, "One");
    assert.equal(items[2].localName, "div");
    assert.equal(items[2].textContent, "Two");
  });
});
