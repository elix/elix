import DelegateInputLabelMixin from "../../src/base/DelegateInputLabelMixin.js";
import { inputDelegate } from "../../src/base/internal.js";
import WrappedStandardElement from "../../src/base/WrappedStandardElement.js";
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

describe("DelegateInputLabelMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("moves aria-label to inner element", (done) => {
    const fixture = new DelegateInputLabelTest();
    fixture.setAttribute("aria-label", "Aardvark");
    container.append(fixture);
    assert.equal(fixture[inputDelegate].getAttribute("aria-label"), null);
    fixture[inputDelegate].addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(fixture.getAttribute("aria-label"), null);
      assert.equal(
        fixture[inputDelegate].getAttribute("aria-label"),
        "Aardvark"
      );
      done();
    });
    dispatchSyntheticFocusEvent(fixture[inputDelegate]);
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
    fixture[inputDelegate].addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(fixture[inputDelegate].getAttribute("aria-label"), "A B C");
      done();
    });
    dispatchSyntheticFocusEvent(fixture[inputDelegate]);
  });

  it("obtains for=id label on focus", (done) => {
    container.innerHTML = `
      <span for="fixture">Baboon</span>
      <delegate-input-label-test id="fixture"></delegate-input-label-test>
    `;
    const fixture = container.querySelector("delegate-input-label-test");
    assert.equal(fixture[inputDelegate].getAttribute("aria-label"), null);
    fixture[inputDelegate].addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(fixture[inputDelegate].getAttribute("aria-label"), "Baboon");
      done();
    });
    dispatchSyntheticFocusEvent(fixture[inputDelegate]);
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
    fixture[inputDelegate].addEventListener("focus", async () => {
      await Promise.resolve(); // Wait for mixin's post-focus render.
      assert.equal(
        fixture[inputDelegate].getAttribute("aria-label"),
        "Chimpanzee"
      );
      done();
    });
    dispatchSyntheticFocusEvent(fixture[inputDelegate]);
  });
});
