import {
  hasDynamicTemplate,
  ids,
  render,
  shadowRoot,
  shadowRootMode,
  template,
} from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ShadowTemplateMixin from "../../src/core/ShadowTemplateMixin.js";
import { assert } from "../testHelpers.js";

/* Element with a simple template */
class ElementWithStringTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[render]();
  }

  get [template]() {
    return templateFrom.html`<div id="message">Hello</div>`;
  }
}
customElements.define(
  "element-with-string-template",
  ElementWithStringTemplate
);

/* Element with a real template */
const elementTemplate = document.createElement("template");
elementTemplate.innerHTML = `Hello`;
class ElementWithRealTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[render]();
  }

  get [template]() {
    return elementTemplate;
  }
}
customElements.define("element-with-real-template", ElementWithRealTemplate);

/* Normal element whose template will only be retrieved once. */
let staticTemplateCount = 0;
class ElementWithCachedTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[render]();
  }

  get [template]() {
    return templateFrom.html`${staticTemplateCount++}`;
  }
}
customElements.define(
  "element-with-cached-template",
  ElementWithCachedTemplate
);

/* Element whose template should be retrieved each time. */
let dynamicTemplateCount = 0;
class ElementWithDynamicTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[render]();
  }

  get [hasDynamicTemplate]() {
    return true;
  }

  get [template]() {
    return templateFrom.html`${dynamicTemplateCount++}`;
  }
}
customElements.define(
  "element-with-dynamic-template",
  ElementWithDynamicTemplate
);

/* Element with closed shadow root. */
class ElementWithClosedRoot extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[render]();
  }
  /** @type {'closed'|'open'} */
  get [shadowRootMode]() {
    return "closed";
  }
  get [template]() {
    return templateFrom.html`<div id="message">Hello</div>`;
  }
}
customElements.define("element-with-closed-root", ElementWithClosedRoot);

/* Element with no template. */
let templateCallCount = 0;
class ElementWithNoTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[render]();
  }
  get [template]() {
    templateCallCount++;
    return undefined;
  }
}
customElements.define("element-with-no-template", ElementWithNoTemplate);

describe("ShadowTemplateMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("stamps string template into root", () => {
    const fixture = new ElementWithStringTemplate();
    assert(fixture.shadowRoot);
    assert(fixture[shadowRoot]);
    // @ts-ignore prevent tsc error "`*.shadowRoot` might be null"
    assert.equal(fixture.shadowRoot.textContent.trim(), "Hello");
  });

  it("stamps real template into root", () => {
    const fixture = new ElementWithRealTemplate();
    assert(fixture.shadowRoot);
    // @ts-ignore prevent tsc error "`*.shadowRoot` might be null"
    assert.equal(fixture.shadowRoot.textContent.trim(), "Hello");
  });

  it("generates this[ids] references for shadow elements with 'id' attributes", () => {
    const fixture = new ElementWithStringTemplate();
    const root = fixture.shadowRoot;
    const message = root && root.getElementById("message");
    assert.equal(fixture[ids].message, message);
  });

  it("caches the template for a component", () => {
    const fixture1 = new ElementWithCachedTemplate();
    // @ts-ignore prevent tsc error "`*.shadowRoot` might be null"
    assert.equal(fixture1.shadowRoot.textContent.trim(), "0");
    const fixture2 = new ElementWithCachedTemplate();
    // @ts-ignore prevent tsc error "`*.shadowRoot` might be null"
    assert.equal(fixture2.shadowRoot.textContent.trim(), "0");
  });

  it("retrieves a dynamic template each time", () => {
    const fixture1 = new ElementWithDynamicTemplate();
    // @ts-ignore prevent tsc error "`*.shadowRoot` might be null"
    assert.equal(fixture1.shadowRoot.textContent.trim(), "0");
    const fixture2 = new ElementWithDynamicTemplate();
    // @ts-ignore prevent tsc error "`*.shadowRoot` might be null"
    assert.equal(fixture2.shadowRoot.textContent.trim(), "1");
  });

  it("can optionally create a closed shadow root", () => {
    const fixture = new ElementWithClosedRoot();
    container.append(fixture);
    assert.isNull(fixture.shadowRoot);
    assert(fixture[shadowRoot]);
  });

  it("asks for a template once, even if no template is defined", () => {
    new ElementWithNoTemplate();
    new ElementWithNoTemplate();
    assert.equal(templateCallCount, 1);
  });
});
