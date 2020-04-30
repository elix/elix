import ContentItemsMixin from "../../src/base/ContentItemsMixin.js";
import * as internal from "../../src/base/internal.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class ContentItemsTest extends ContentItemsMixin(ReactiveMixin(HTMLElement)) {
  // Force an update of state.
  // Normally this would be handled automatically, e.g., via SlotContentMixin.
  updateContent() {
    // Copy content.
    const content = [...this.children];
    this[internal.setState]({ content });
  }
}
customElements.define("content-items-test", ContentItemsTest);

describe("ContentItemsMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("defines items as substantive content elements", () => {
    const fixture = new ContentItemsTest();
    fixture.innerHTML = `
      <style></style>
      <div>1</div>
      <div>2</div>
    `;
    fixture.updateContent();
    const items = fixture[internal.state].items;
    assert.equal(items.length, 2);
    assert.equal(items[0].textContent, "1");
    assert.equal(items[1].textContent, "2");
  });
});
