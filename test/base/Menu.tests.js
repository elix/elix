import { raiseChangeEvents, state } from "../../src/base/internal.js";
import Menu from "../../src/base/Menu.js";
import MenuItem from "../../src/base/MenuItem.js";
import { assert } from "../testHelpers.js";

customElements.define("menu-test", Menu);
customElements.define("menu-item-test", MenuItem);

describe("Menu", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("can track which menu items are enabled/disabled", async () => {
    const fixture = new Menu();
    fixture.innerHTML = `
      <menu-item-test></menu-item-test>
      <menu-item-test disabled></menu-item-test>
      <menu-item-test></menu-item-test>
    `;
    container.append(fixture);
    // Wait for initial render.
    await Promise.resolve();
    assert.deepEqual(fixture[state].availableItemFlags, [true, false, true]);

    const menuItem = fixture.children[0];
    // Simulate user interaction that would cause a menu item to be disabled.
    menuItem[raiseChangeEvents] = true;
    /** @type {any} */ (menuItem).disabled = true;
    // Wait for disabled-changed event to propagate.
    await Promise.resolve();
    assert.deepEqual(fixture[state].availableItemFlags, [false, false, true]);
  });
});
