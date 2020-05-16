import { fragmentFrom, templateFrom } from "../../src/core/htmlLiterals.js";
import { assert } from "../testHelpers.js";

describe("htmlLiterals", () => {
  it("fragmentFrom.html function returns a DocumentFragment", () => {
    const fixture = fragmentFrom.html`<div>Hello</div>`;
    assert(fixture instanceof DocumentFragment);
    assert.equal(fixture.children.length, 1);
    assert.equal(fixture.children[0].localName, "div");
    assert.equal(fixture.children[0].textContent, "Hello");
  });

  it("templateFrom.html function returns an HTMLTemplateElement", () => {
    const fixture = templateFrom.html`<div>Hello</div>`;
    assert(fixture instanceof HTMLTemplateElement);
    assert.equal(fixture.innerHTML, `<div>Hello</div>`);
  });
});
