import { assert } from '../test-helpers.js';
import * as internal from "../../src/internal.js";
import WrappedStandardElement from "../../src/WrappedStandardElement.js";

const WrappedA = WrappedStandardElement.wrap("a");
customElements.define("wrapped-a", WrappedA);

const WrappedButton = WrappedStandardElement.wrap("button");
customElements.define("wrapped-button", WrappedButton);

const WrappedDiv = WrappedStandardElement.wrap("div");
customElements.define("wrapped-div", WrappedDiv);

const WrappedImg = WrappedStandardElement.wrap("img");
customElements.define("wrapped-img", WrappedImg);

const WrappedInput = WrappedStandardElement.wrap("input");
customElements.define("wrapped-input", WrappedInput);

describe("WrappedStandardElement", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("creates an instance of the wrapped element", () => {
    const fixture = new WrappedA();
    fixture[internal.renderChanges]();
    assert(fixture.inner instanceof HTMLAnchorElement);
  });

  it("exposes getter/setters that proxy to the wrapped element", () => {
    const fixture = new WrappedA();
    fixture.href = "http://localhost/foo/bar.html";
    container.appendChild(fixture);
    assert.propertyVal(fixture.inner, "href", "http://localhost/foo/bar.html");
    assert.equal(fixture.protocol, "http:");
    assert.equal(fixture.hostname, "localhost");
    assert.equal(fixture.pathname, "/foo/bar.html");
  });

  it("marshals attributes to properties on the inner element", () => {
    const fixture = new WrappedA();
    container.appendChild(fixture);
    fixture.setAttribute("href", "http://example.com/");
    fixture[internal.renderChanges]();
    assert.propertyVal(fixture.inner, "href", "http://example.com/");
  });

  it("re-raises events not automatically retargetted by Shadow DOM", done => {
    const fixture = new WrappedImg();
    container.appendChild(fixture);
    fixture.addEventListener("load", () => {
      done();
    });
    // Load a 1x1 pixel image to trigger the load event.
    fixture.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
  });

  it("does not raise events if inner element is disabled", () => {
    const fixture = new WrappedButton();
    container.appendChild(fixture);
    let count = 0;
    fixture.addEventListener("click", () => {
      count++;
    });
    fixture.click();
    fixture.disabled = true;
    fixture[internal.renderChanges]();
    fixture.click();
    assert.equal(count, 1);
  });

  it("chooses an appropriate :host display style based on the wrapped element", () => {
    const fixtureA = new WrappedA();
    container.appendChild(fixtureA);
    const fixtureDiv = new WrappedDiv();
    container.appendChild(fixtureDiv);
    assert.equal(getComputedStyle(fixtureA).display, "inline-block");
    assert.equal(getComputedStyle(fixtureDiv).display, "block");
  });

  it("delegates boolean attributes", async () => {
    const fixture = new WrappedButton();
    container.appendChild(fixture);

    // Disable via property.
    fixture.disabled = true;
    fixture[internal.renderChanges]();
    assert.propertyVal(fixture.inner, "disabled", true);

    // // Re-enable via property.
    fixture.disabled = false;
    fixture[internal.renderChanges]();
    assert.propertyVal(fixture.inner, "disabled", false);

    // Disable via attribute.
    fixture.setAttribute("disabled", "");
    fixture[internal.renderChanges]();
    assert.propertyVal(fixture.inner, "disabled", "");

    // Re-enable via attribute.
    fixture.removeAttribute("disabled");
    fixture[internal.renderChanges]();
    assert.notProperty(fixture.inner, "disabled");
  });

  it("delegates tabindex state to inner element", async () => {
    const fixture = new WrappedInput();
    container.appendChild(fixture);
    // NB: tabIndex is not part of WrappedInput's regular state; we're just
    // defining it. WrappedStandardElement should respect that.
    await fixture[internal.setState]({ tabIndex: 1 });
    assert.equal(fixture.inner.tabIndex, 1);
  });

  it("delegates methods", async () => {
    const fixture = new WrappedInput();
    fixture.value = "Hello";
    container.appendChild(fixture);
    fixture.setSelectionRange(1, 4);
    assert.equal(fixture.selectionStart, 1);
    assert.equal(fixture.selectionEnd, 4);
    fixture.focus();
    assert.equal(fixture.shadowRoot.activeElement, fixture.inner);
  });

  it("delegates attributes that don't correspond to properties", async () => {
    const fixture = new WrappedInput();
    fixture.setAttribute("readonly", "");
    fixture[internal.renderChanges]();
    assert.equal(fixture.inner.getAttribute("readonly"), "");
  });
});
