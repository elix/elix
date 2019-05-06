import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ShadowTemplateMixin from '../../src/ShadowTemplateMixin.js';


/* Element with a simple template */
class ElementWithStringTemplate extends ShadowTemplateMixin(HTMLElement) {

  constructor() {
    super();
    this[symbols.populate]();
  }

  get [symbols.template]() {
    return template.html`<div id="message">Hello</div>`;
  }

}
customElements.define('element-with-string-template', ElementWithStringTemplate);


/* Element with a real template */
const elementTemplate = document.createElement('template');
elementTemplate.innerHTML = `Hello`;
class ElementWithRealTemplate extends ShadowTemplateMixin(HTMLElement) {

  constructor() {
    super();
    this[symbols.populate]();
  }

  get [symbols.template]() {
    return elementTemplate;
  }

}
customElements.define('element-with-real-template', ElementWithRealTemplate);


/* Element with styles to polyfill. */
class ElementWithStylesInTemplate extends ShadowTemplateMixin(HTMLElement) {

  constructor() {
    super();
    this[symbols.populate]();
  }

  get [symbols.template]() {
    return template.html`
      <style>
        /* Use a style that will get polyfilled. */
        :host {
          background: rgb(255, 0, 0);
        }
      </style>
    `;
  }

}
customElements.define('element-with-styles-in-template', ElementWithStylesInTemplate);


/* Normal element whose template will only be retrieved once. */
let staticTemplateCount = 0;
class ElementWithCachedTemplate extends ShadowTemplateMixin(HTMLElement) {

  constructor() {
    super();
    this[symbols.populate]();
  }

  get [symbols.template]() {
    return template.html`${staticTemplateCount++}`;
  }

}
customElements.define('element-with-cached-template', ElementWithCachedTemplate);


/* Element whose template should be retrieved each time. */
let dynamicTemplateCount = 0;
class ElementWithDynamicTemplate extends ShadowTemplateMixin(HTMLElement) {

  constructor() {
    super();
    this[symbols.populate]();
  }

  get [symbols.hasDynamicTemplate]() {
    return true;
  }

  get [symbols.template]() {
    return template.html`${dynamicTemplateCount++}`;
  }

}
customElements.define('element-with-dynamic-template', ElementWithDynamicTemplate);


describe("ShadowTemplateMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("stamps string template into root", () => {
    const fixture = document.createElement('element-with-string-template');
    assert(fixture.shadowRoot);
    assert.equal(fixture.shadowRoot.textContent.trim(), "Hello");
  });

  it("stamps real template into root", () => {
    const fixture = document.createElement('element-with-real-template');
    assert(fixture.shadowRoot);
    assert.equal(fixture.shadowRoot.textContent.trim(), "Hello");
  });

  it("generates this.$ references for shadow elements with 'id' attributes", () => {
    const fixture = document.createElement('element-with-string-template');
    const root = fixture.shadowRoot;
    assert.equal(fixture.$.message, root.querySelector('#message'));
  });

  it("caches the template for a component", () => {
    const fixture1 = document.createElement('element-with-cached-template');
    assert.equal(fixture1.shadowRoot.textContent.trim(), '0');
    const fixture2 = document.createElement('element-with-cached-template');
    assert.equal(fixture2.shadowRoot.textContent.trim(), '0');
  });

  it("retrieves a dynamic template each time", () => {
    const fixture1 = document.createElement('element-with-dynamic-template');
    assert.equal(fixture1.shadowRoot.textContent.trim(), '0');
    const fixture2 = document.createElement('element-with-dynamic-template');
    assert.equal(fixture2.shadowRoot.textContent.trim(), '1');
  });

});
