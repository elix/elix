import { assert } from "../testHelpers.js";
import {
  composedAncestors,
  firstFocusableElement,
  updateChildNodes
} from "../../src/core/dom.js";
import * as template from "../../src/core/template.js";

describe("DOM helpers", () => {
  it("firstFocusableElement finds first focusable element in light DOM", () => {
    const fixture = template.html`
      <div></div>
      <input tabindex="-1">
      <button disabled>Disabled</button>
      <div>
        <button id="enabled"></button>
      </div>
      <a href="about:blank"></a>
    `;
    const element = firstFocusableElement(fixture.content);
    const button = fixture.content.querySelector("#enabled");
    assert.equal(element, button);
  });

  it("firstFocusableElement finds first focusable element in composed tree", () => {
    const fixture = document.createElement("div");
    const fixtureTemplate = template.html`
      <div></div>
      <slot></slot>
      <button id="enabled"></button>
    `;
    const shadowRoot = fixture.attachShadow({ mode: "open" });
    const shadowContent = document.importNode(fixtureTemplate.content, true);
    shadowRoot.appendChild(shadowContent);
    const childrenTemplate = template.html`
      <div>
        <input>
      </div>
    `;
    const childrenContent = document.importNode(childrenTemplate.content, true);
    fixture.appendChild(childrenContent);
    const element = firstFocusableElement(shadowRoot);
    const input = fixture.querySelector("input");
    assert.equal(element, input);
  });

  it("updateChildNodes updates child nodes", () => {
    const fixture = document.createElement("div");
    const existingChild = document.createTextNode("existing");
    fixture.appendChild(existingChild);
    const nodes = [
      document.createTextNode("one"),
      document.createTextNode("two")
    ];
    updateChildNodes(fixture, nodes);
    assert.equal(fixture.childNodes.length, 2);
    assert.equal(fixture.childNodes[0], nodes[0]);
    assert.equal(fixture.childNodes[1], nodes[1]);
    assert.isNull(existingChild.parentNode);
  });

  it("can return the set of ancestors in a composed tree", () => {
    // Tree:
    //
    // outer
    //   host
    //     #shadow-root
    //       p
    //         slot
    //     button (will be assigned to slot)
    //       strong
    //         "Hello"
    //
    const outer = document.createElement("div");
    const host = document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const p = document.createElement("p");
    const slot = document.createElement("slot");
    const button = document.createElement("button");
    const strong = document.createElement("strong");
    const text = new Text("Hello");
    strong.append(text);
    button.append(strong);
    host.append(button);
    outer.append(host);
    p.append(slot);
    root.append(p);

    const ancestors = [...composedAncestors(text)];
    assert.deepEqual(ancestors, [strong, button, slot, p, root, host, outer]);
  });
});
