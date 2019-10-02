import * as internal from '../../src/internal.js';
import * as template from '../../src/template.js';
import ShadowTemplateMixin from '../../src/ShadowTemplateMixin.js';

/* Element with a simple template */
class ElementWithStringTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[internal.render]();
  }

  get [internal.template]() {
    return template.html`<div id="message">Hello</div>`;
  }
}
customElements.define(
  'element-with-string-template',
  ElementWithStringTemplate
);

/* Element with a real template */
const elementTemplate = document.createElement('template');
elementTemplate.innerHTML = `Hello`;
class ElementWithRealTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[internal.render]();
  }

  get [internal.template]() {
    return elementTemplate;
  }
}
customElements.define('element-with-real-template', ElementWithRealTemplate);

/* Normal element whose template will only be retrieved once. */
let staticTemplateCount = 0;
class ElementWithCachedTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[internal.render]();
  }

  get [internal.template]() {
    return template.html`${staticTemplateCount++}`;
  }
}
customElements.define(
  'element-with-cached-template',
  ElementWithCachedTemplate
);

/* Element whose template should be retrieved each time. */
let dynamicTemplateCount = 0;
class ElementWithDynamicTemplate extends ShadowTemplateMixin(HTMLElement) {
  constructor() {
    super();
    this[internal.render]();
  }

  get [internal.hasDynamicTemplate]() {
    return true;
  }

  get [internal.template]() {
    return template.html`${dynamicTemplateCount++}`;
  }
}
customElements.define(
  'element-with-dynamic-template',
  ElementWithDynamicTemplate
);

describe('ShadowTemplateMixin', () => {
  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it('stamps string template into root', () => {
    const fixture = new ElementWithStringTemplate();
    assert(fixture.shadowRoot);
    assert.equal(fixture.shadowRoot.textContent.trim(), 'Hello');
  });

  it('stamps real template into root', () => {
    const fixture = new ElementWithRealTemplate();
    assert(fixture.shadowRoot);
    assert.equal(fixture.shadowRoot.textContent.trim(), 'Hello');
  });

  it("generates this[internal.ids] references for shadow elements with 'id' attributes", () => {
    const fixture = new ElementWithStringTemplate();
    const root = fixture.shadowRoot;
    assert.equal(fixture[internal.ids].message, root.querySelector('#message'));
  });

  it('caches the template for a component', () => {
    const fixture1 = new ElementWithCachedTemplate();
    assert.equal(fixture1.shadowRoot.textContent.trim(), '0');
    const fixture2 = new ElementWithCachedTemplate();
    assert.equal(fixture2.shadowRoot.textContent.trim(), '0');
  });

  it('retrieves a dynamic template each time', () => {
    const fixture1 = new ElementWithDynamicTemplate();
    assert.equal(fixture1.shadowRoot.textContent.trim(), '0');
    const fixture2 = new ElementWithDynamicTemplate();
    assert.equal(fixture2.shadowRoot.textContent.trim(), '1');
  });
});
