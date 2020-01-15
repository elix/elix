import { assert } from '../chai.js';
import * as internal from "../../src/internal.js";
import DarkModeMixin from "../../src/DarkModeMixin.js";
import ReactiveMixin from "../../src/ReactiveMixin.js";

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
    assert(fixture[internal.state].darkMode);
  });

  it("infers no dark mode when the element or ancestor has a light background color", async () => {
    const fixture = new DarkModeTest();
    const parent = document.createElement("div");
    parent.style.backgroundColor = "#aaa";
    parent.appendChild(fixture);
    container.appendChild(parent);
    await Promise.resolve();
    assert(!fixture[internal.state].darkMode);
  });
});
