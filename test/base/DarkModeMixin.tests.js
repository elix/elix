import DarkModeMixin from "../../src/base/DarkModeMixin.js";
import { state } from "../../src/base/internal.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

class DarkModeTest extends DarkModeMixin(ReactiveMixin(HTMLElement)) {}
customElements.define("dark-mode-test", DarkModeTest);

describe("DarkModeMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("infers dark mode when the element or ancestor has a dark background color", async () => {
    const fixture = new DarkModeTest();
    const parent = document.createElement("div");
    parent.style.backgroundColor = "#222";
    parent.appendChild(fixture);
    container.appendChild(parent);
    await Promise.resolve();
    assert(fixture[state].dark);
  });

  it("infers no dark mode when the element or ancestor has a light background color", async () => {
    const fixture = new DarkModeTest();
    const parent = document.createElement("div");
    parent.style.backgroundColor = "#aaa";
    parent.appendChild(fixture);
    container.appendChild(parent);
    await Promise.resolve();
    assert(!fixture[state].dark);
  });
});
