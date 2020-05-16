import {
  defaultState,
  ids,
  render,
  renderChanges,
  setState,
  state,
  template,
} from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import { createElement, replace, transmute } from "../../src/core/template.js";
import { assert } from "../testHelpers.js";

class TemplateTest extends HTMLElement {}
customElements.define("template-test", TemplateTest);

// A component with a template with a single part.
class DynamicSingle extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      dynamicPartType: "button",
    });
  }

  [render](changed) {
    super[render](changed);
    if (changed.dynamicPartType) {
      transmute(this[ids].dynamic, this[state].dynamicPartType);
    }
  }

  get [template]() {
    return templateFrom.html`
      <div id="static">This doesn't change</div>
      <div id="dynamic" class="foo">This element changes</div>
    `;
  }
}
customElements.define("dynamic-part-type", DynamicSingle);

describe("templates", () => {
  it("can create an element from a string descriptor", () => {
    const fixture = createElement("div");
    assert(fixture instanceof HTMLDivElement);
  });

  it("can create an element from a class constructor", () => {
    const fixture = createElement(TemplateTest);
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
    replace(original, replacement);
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

  it("lets an element replace a part during initial rendering", async () => {
    const fixture = new DynamicSingle();
    fixture[renderChanges]();
    assert(fixture[ids].static instanceof HTMLDivElement);
    assert(fixture[ids].dynamic instanceof HTMLButtonElement);
    assert.equal(fixture[ids].dynamic.getAttribute("id"), "dynamic");
    assert.equal(fixture[ids].dynamic.textContent, "This element changes");
    assert(fixture[ids].dynamic.classList.contains("foo"));
  });

  it("lets an element replace a part after initial rendering", async () => {
    const fixture = new DynamicSingle();
    fixture[renderChanges]();
    assert(fixture[ids].static instanceof HTMLDivElement);
    assert(fixture[ids].dynamic instanceof HTMLButtonElement);
    fixture[setState]({
      dynamicPartType: "a",
    });
    fixture[renderChanges]();
    assert(fixture[ids].dynamic instanceof HTMLAnchorElement);
    assert.equal(fixture[ids].dynamic.getAttribute("id"), "dynamic");
    assert.equal(fixture[ids].dynamic.textContent, "This element changes");
    assert(fixture[ids].dynamic.classList.contains("foo"));
  });
});
