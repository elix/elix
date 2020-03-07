import { assert } from "../testHelpers.js";
import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import DelegateFocusMixin from "../../src/base/DelegateFocusMixin.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

class DelegateFocusTest extends DelegateFocusMixin(ReactiveElement) {
  get [internal.template]() {
    return template.html`
      <input>
    `;
  }
}

customElements.define("delegate-focus-test", DelegateFocusTest);

describe("DelegateFocusMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("delegates focus to an inner element", () => {
    const fixture = new DelegateFocusTest();
    container.appendChild(fixture);
    fixture.focus();
    const root = fixture.shadowRoot;
    const activeElement = root && root.activeElement;
    const input = root && root.querySelector("input");
    assert.equal(activeElement, input);
  });
});
