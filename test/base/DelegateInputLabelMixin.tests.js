import DelegateFocusMixin from "../../src/base/DelegateFocusMixin.js";
import DelegateInputLabelMixin from "../../src/base/DelegateInputLabelMixin.js";
import { ids, inputDelegate, template } from "../../src/base/internal.js";
import WrappedStandardElement from "../../src/base/WrappedStandardElement.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import { dispatchSyntheticFocusEvent } from "../mockInteractions.js";
import { assert } from "../testHelpers.js";

class DelegateInputLabelTest extends DelegateInputLabelMixin(
  WrappedStandardElement.wrap("input")
) {
  get [inputDelegate]() {
    return this.inner;
  }
}
customElements.define("delegate-input-label-test", DelegateInputLabelTest);

class NestedInputTest extends DelegateFocusMixin(
  DelegateInputLabelMixin(ReactiveElement)
) {
  get [inputDelegate]() {
    return this[ids].input;
  }

  get [template]() {
    return templateFrom.html`
      <delegate-input-label-test id="input"></delegate-input-label-test>
    `;
  }
}
customElements.define("nested-input-test", NestedInputTest);

describe("DelegateInputLabelMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("moves aria-label to inner element", () => {
    const fixture = new DelegateInputLabelTest();
    fixture.setAttribute("aria-label", "Aardvark");
    container.append(fixture);
    assert.equal(fixture.getAttribute("aria-label"), null);
    assert.equal(fixture[inputDelegate].getAttribute("aria-label"), "Aardvark");
  });

  it("obtains aria-labelledby labels on focus", (done) => {
    container.innerHTML = `
      <span id="label1">A</span>
      <span id="label2">B</span>
      <span id="label3">C</span>
      <delegate-input-label-test aria-labelledby="label1 label2 label3">
      </delegate-input-label-test>
    `;
    const fixture = container.querySelector("delegate-input-label-test");
    assert.equal(fixture[inputDelegate].getAttribute("aria-label"), null);
    fixture.addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(fixture[inputDelegate].getAttribute("aria-label"), "A B C");
      done();
    });
    dispatchSyntheticFocusEvent(fixture);
  });

  it("obtains for=id label on focus", (done) => {
    container.innerHTML = `
      <span for="fixture">Baboon</span>
      <delegate-input-label-test id="fixture"></delegate-input-label-test>
    `;
    const fixture = container.querySelector("delegate-input-label-test");
    assert.equal(fixture[inputDelegate].getAttribute("aria-label"), null);
    fixture.addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(fixture[inputDelegate].getAttribute("aria-label"), "Baboon");
      done();
    });
    dispatchSyntheticFocusEvent(fixture);
  });

  it("obtains wrapping label on focus", (done) => {
    container.innerHTML = `
      <label>
        Chimpanzee
        <delegate-input-label-test></delegate-input-label-test>
      </label>
    `;
    const fixture = container.querySelector("delegate-input-label-test");
    assert.equal(fixture[inputDelegate].getAttribute("aria-label"), null);
    fixture.addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(
        fixture[inputDelegate].getAttribute("aria-label"),
        "Chimpanzee"
      );
      done();
    });
    dispatchSyntheticFocusEvent(fixture);
  });

  it("supports nested layers of label delegation", async () => {
    const fixture = new NestedInputTest();
    fixture.setAttribute("aria-label", "Dingo");
    container.append(fixture);
    const innermostInput = fixture[inputDelegate][inputDelegate];
    await Promise.resolve(); // Wait for inner element to move aria-label.
    assert.equal(innermostInput.getAttribute("aria-label"), "Dingo");
  });

  it("gives precedence to aria-labelledby over aria-label", (done) => {
    container.innerHTML = `
      <span id="span">Echidna</span>
      <delegate-input-label-test aria-labelledby="span" aria-label="Fox">
      </delegate-input-label-test>
    `;
    const fixture = container.querySelector("delegate-input-label-test");
    fixture.addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(
        fixture[inputDelegate].getAttribute("aria-label"),
        "Echidna"
      );
      done();
    });
    dispatchSyntheticFocusEvent(fixture);
  });
});
