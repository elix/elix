import DelegateFocusMixin from "../../src/base/DelegateFocusMixin.js";
import { template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import { assert } from "../testHelpers.js";

class DelegateFocusTest extends DelegateFocusMixin(ReactiveElement) {
  get [template]() {
    return templateFrom.html`
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
