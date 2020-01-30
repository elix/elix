import { assert } from "../testHelpers.js";
import * as internal from "../../src/internal.js";
import * as mockInteractions from "../mockInteractions.js";
import ListBox from "../../define/ListBox.js";

describe("ListBox", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("raises a selected-index-changed event when an item is clicked", async () => {
    const fixture = createSampleListBox();
    container.appendChild(fixture);
    // Wait for initial content.
    await Promise.resolve();
    assert.equal(fixture[internal.state].selectedIndex, -1);
    const item = fixture.items[0];
    const eventPromise = new Promise(resolve => {
      fixture.addEventListener("selected-index-changed", () => {
        assert.equal(fixture[internal.state].selectedIndex, 0);
        resolve();
      });
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, "mousedown");
    await eventPromise;
  });

  it("accepts the selected-index attribute in markup", async () => {
    container.innerHTML = `
      <elix-list-box selected-index="2">
        <div>Zero</div>
        <div>One</div>
        <div>Two</div>
      </elix-list-box>
    `;
    const fixture = container.querySelector("elix-list-box");
    // Wait for initial content.
    await Promise.resolve();
    assert.equal(fixture.selectedIndex, 2);
    assert.equal(fixture.selectedItem, fixture.children[2]);
  });
});

function createSampleListBox() {
  const fixture = new ListBox();
  ["Zero", "One", "Two"].forEach(text => {
    const div = document.createElement("div");
    div.textContent = text;
    fixture.appendChild(div);
  });
  return fixture;
}
