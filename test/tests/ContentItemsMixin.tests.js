import { assert } from "../testHelpers.js";
import * as internal from "../../src/base/internal.js";
import ContentItemsMixin from "../../src/base/ContentItemsMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";

class ContentItemsTest extends ContentItemsMixin(ReactiveMixin(HTMLElement)) {
  connectedCallback() {
    this.updateContent();
  }

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

  it("returns substantive content elements as items", () => {
    const fixture = new ContentItemsTest();
    fixture.innerHTML = `
      <style></style>
      <div>1</div>
      <div>2</div>
    `;
    fixture.updateContent();
    const items = fixture.items;
    assert.equal(items.length, 2);
    assert.equal(items[0].textContent, "1");
    assert.equal(items[1].textContent, "2");
  });

  it("raises items-changed event", done => {
    const fixture = new ContentItemsTest();
    fixture.addEventListener("items-changed", () => {
      done();
    });
    // Arrange for raising of change events.
    fixture[internal.raiseChangeEvents] = true;
    container.appendChild(fixture);
    // Wait for first render.
    setTimeout(() => {
      fixture.innerHTML = `
        <div>1</div>
        <div>2</div>
        <div>3</div>
      `;
      fixture.updateContent();
    });
  });
});
