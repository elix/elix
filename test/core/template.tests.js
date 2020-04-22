import * as internal from "../../src/base/internal.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import * as template from "../../src/core/template.js";
import { assert } from "../testHelpers.js";

class TemplateTest extends HTMLElement {}
customElements.define("template-test", TemplateTest);

// A component with a template with a role applied to a single element.
class DynamicSingle extends ReactiveElement {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      dynamicPartType: "button",
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    if (changed.dynamicPartType) {
      template.transmute(
        this[internal.ids].dynamic,
        this[internal.state].dynamicPartType
      );
    }
  }

  get [internal.template]() {
    return template.html`
      <div id="static">This doesn't change</div>
      <div id="dynamic" class="foo">This element changes</div>
    `;
  }
}
customElements.define("dynamic-part-type", DynamicSingle);

describe("templates", () => {
  it("html template function returns an HTMLTemplateElement", () => {
    const fixture = template.html`<div>Hello</div>`;
    assert(fixture instanceof HTMLTemplateElement);
    assert.equal(fixture.innerHTML, `<div>Hello</div>`);
  });

  it("can create an element from a string descriptor", () => {
    const fixture = template.createElement("div");
    assert(fixture instanceof HTMLDivElement);
  });

  it("can create an element from a class constructor", () => {
    const fixture = template.createElement(TemplateTest);
    assert(fixture instanceof TemplateTest);
  });

  it("can substitute one element for another", () => {
    const original = document.createElement("button");
    original.setAttribute("id", "original");
    original.style.color = "red";
    original.textContent = "Hello";
    const fixture = document.createElement("div");
    fixture.appendChild(original);
    const replacement = document.createElement("a");
    replacement.setAttribute("id", "replacement");
    template.replace(original, replacement);
    // Replacement should have taken place of original element.
    assert.equal(replacement.parentNode, fixture);
    assert.equal(original.parentNode, null);
    // Replacement should have picked up attributes from original
    // that weren't already specified on replacement.
    assert.equal(replacement.getAttribute("id"), "replacement");
    assert.equal(replacement.style.color, "red");
    // Replacement should have picked up a copy of original's children.
    assert.equal(replacement.textContent, "Hello");
  });

  it("supports an element with a role during initial rendering", async () => {
    const fixture = new DynamicSingle();
    fixture[internal.renderChanges]();
    assert(fixture[internal.ids].static instanceof HTMLDivElement);
    assert(fixture[internal.ids].dynamic instanceof HTMLButtonElement);
    assert.equal(fixture[internal.ids].dynamic.getAttribute("id"), "dynamic");
    assert.equal(
      fixture[internal.ids].dynamic.textContent,
      "This element changes"
    );
    assert(fixture[internal.ids].dynamic.classList.contains("foo"));
  });

  it("lets an element change a role after initial rendering", async () => {
    const fixture = new DynamicSingle();
    fixture[internal.renderChanges]();
    assert(fixture[internal.ids].static instanceof HTMLDivElement);
    assert(fixture[internal.ids].dynamic instanceof HTMLButtonElement);
    fixture[internal.setState]({
      dynamicPartType: "a",
    });
    fixture[internal.renderChanges]();
    assert(fixture[internal.ids].dynamic instanceof HTMLAnchorElement);
    assert.equal(fixture[internal.ids].dynamic.getAttribute("id"), "dynamic");
    assert.equal(
      fixture[internal.ids].dynamic.textContent,
      "This element changes"
    );
    assert(fixture[internal.ids].dynamic.classList.contains("foo"));
  });
});
