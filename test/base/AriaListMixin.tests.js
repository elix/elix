import AriaListMixin from "../../src/base/AriaListMixin.js";
import ContentItemsMixin from "../../src/base/ContentItemsMixin.js";
import { renderChanges, setState, state } from "../../src/base/internal.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import { assert } from "../testHelpers.js";

class AriaListTest extends AriaListMixin(ContentItemsMixin(ReactiveElement)) {
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    const content = [...this.children];
    this[setState]({ content });
  }
}
customElements.define("aria-list-test", AriaListTest);

describe("AriaListMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("assigns default roles to list and items, and default IDs to items without IDs", async () => {
    const fixture = new AriaListTest();
    fixture.id = "test"; // Will be used as basis for assigned item IDs.
    const item1 = document.createElement("div");
    item1.id = "explicitID";
    fixture.append(item1);
    // Leave item2 without an ID.
    const item2 = document.createElement("div");
    fixture.append(item2);
    container.append(fixture);
    await Promise.resolve();
    assert.equal(fixture.getAttribute("role"), "listbox"); // default role
    assert.equal(item1.id, "explicitID"); // unchanged
    assert.equal(item1.getAttribute("role"), "option"); // default role
    assert.isNotEmpty(item2.id); // implicitly assigned ID
    assert.equal(item2.getAttribute("role"), "option"); // default role
  });

  it("indicates the selected item on both the list and the item", async () => {
    const fixture = new AriaListTest();
    const item1 = document.createElement("div");
    fixture.append(item1);
    const item2 = document.createElement("div");
    fixture.append(item2);
    container.append(fixture);
    await fixture[setState]({ selectedIndex: 0 });
    assert.equal(fixture.getAttribute("aria-activedescendant"), item1.id);
    assert.equal(item1.getAttribute("aria-selected"), "true");
    assert.equal(item2.getAttribute("aria-selected"), "false");
    await fixture[setState]({ selectedIndex: 1 });
    assert.equal(fixture.getAttribute("aria-activedescendant"), item2.id);
    assert.equal(item1.getAttribute("aria-selected"), "false");
    assert.equal(item2.getAttribute("aria-selected"), "true");
  });

  it("can indicate the selection of multiple items in a multi-select list", async () => {
    const fixture = new AriaListTest();
    fixture.append(
      document.createElement("div"),
      document.createElement("div"),
      document.createElement("div")
    );
    container.append(fixture);
    await fixture[setState]({
      selectedFlags: [true, false, true],
    });
    const items = fixture[state].items;
    assert.equal(items[0].getAttribute("aria-selected"), "true");
    assert.equal(items[1].getAttribute("aria-selected"), "false");
    assert.equal(items[2].getAttribute("aria-selected"), "true");
  });

  it("assigns a default role of 'listbox'", () => {
    const fixture = new AriaListTest();
    fixture[renderChanges]();
    assert.equal(fixture.getAttribute("role"), "listbox");
  });

  it("doesn't overwrite an explicit role in markup", () => {
    container.innerHTML = `<aria-list-test role="tabs"></aria-list-test
  >`;
    const fixture = container.querySelector("aria-list-test");
    container.append(fixture);
    assert.equal(fixture.getAttribute("role"), "tabs");
  });

  it("doesn't apply default role to <option> items", async () => {
    const fixture = new AriaListTest();
    const item1 = document.createElement("option");
    const item2 = document.createElement("option");
    fixture.append(item1);
    fixture.append(item2);
    container.append(fixture);
    await Promise.resolve();
    assert.isNull(item1.getAttribute("role"));
    assert.isNull(item2.getAttribute("role"));
  });
});
