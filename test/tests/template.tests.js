import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';


class TemplateTest extends HTMLElement {}
customElements.define('template-test', TemplateTest);


// A component with a template with a role applied to a single element.
class DynamicSingle extends ReactiveElement {

  constructor() {
    super();
    this[symbols.renderedRoles] = {};
  }

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].dynamicRole !== this.state.dynamicRole) {
      template.transmute(this.$.dynamic, this.state.dynamicRole);
      this[symbols.renderedRoles].dynamicRole = this.state.dynamicRole;
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dynamicRole: 'button'
    });
  }

  get [symbols.template]() {
    return template.html`
      <div id="static">This doesn't change</div>
      <div id="dynamic" class="foo">This element changes</div>
    `;
  }

}
customElements.define('dynamic-role', DynamicSingle);


// A component with a template where a role is applied to multiple elements.
class DynamicMultiple extends ReactiveElement {

  constructor() {
    super();
    this[symbols.renderedRoles] = {};
  }

  [symbols.beforeUpdate]() {
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (this[symbols.renderedRoles].dynamicRole !== this.state.dynamicRole) {
      const dynamics = this.shadowRoot.querySelectorAll('.dynamic');
      template.transmute(dynamics, this.state.dynamicRole);
      this[symbols.renderedRoles].dynamicRole = this.state.dynamicRole;
    }
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      dynamicRole: 'button'
    });
  }

  get [symbols.template]() {
    return template.html`
      <div id="static">This doesn't change</div>
      <div class="dynamic foo">This element changes</div>
      <div class="dynamic foo">This changes too</div>
    `;
  }

}
customElements.define('dynamic-multiple', DynamicMultiple);


describe("templates", () => {

  it("html template function returns an HTMLTemplateElement", () => {
    const fixture = template.html`<div>Hello</div>`;
    assert(fixture instanceof HTMLTemplateElement);
    assert(fixture.innerHTML, `<div>Hello</div>`);
  });

  it("can create an element from a string descriptor", () => {
    const fixture = template.createElement('div');
    assert(fixture instanceof HTMLDivElement);
  });

  it("can create an element from a class constructor", () => {
    const fixture = template.createElement(TemplateTest);
    assert(fixture instanceof TemplateTest);
  });

  it("can create an element by cloning a template", () => {
    const fixtureTemplate = document.createElement('template');
    fixtureTemplate.innerHTML = `<div>Hello</div>`;
    const fixture = template.createElement(fixtureTemplate);
    assert(fixture instanceof HTMLDivElement);
    assert.equal(fixture.textContent, 'Hello');
  });

  it("can substitute one element for another", () => {
    const original = document.createElement('button');
    original.setAttribute('id', 'original');
    original.style.color = 'red';
    original.textContent = 'Hello';
    const fixture = document.createElement('div');
    fixture.appendChild(original);
    const replacement = document.createElement('a');
    replacement.setAttribute('id', 'replacement');
    template.replace(original, replacement);
    // Replacement should have taken place of original element.
    assert.equal(replacement.parentNode, fixture);
    assert.equal(original.parentNode, null);
    // Replacement should have picked up attributes from original
    // that weren't already specified on replacement.
    assert.equal(replacement.getAttribute('id'), 'replacement');
    assert.equal(replacement.style.color, 'red');
    // Replacement should have picked up a copy of original's children.
    assert.equal(replacement.textContent, 'Hello');
  });

  it("can wrap an element in an tree", () => {
    const fixture = document.createElement('section');
    const span = document.createElement('span');
    const text = new Text('Hello');
    span.appendChild(text);
    fixture.appendChild(span);
    const wrapper = document.createElement('div');
    const paragraph = document.createElement('p');
    wrapper.appendChild(paragraph);
    template.wrap(span, wrapper, 'p');
    assert.equal(fixture.childNodes.length, 1);
    assert.equal(fixture.childNodes[0], wrapper);
    assert.equal(span.parentNode, paragraph);
  });

  it("can wrap the contents of a document fragment", () => {
    const fixture = document.createDocumentFragment();
    const text = new Text('Hello');
    fixture.appendChild(text);
    const wrapper = document.createElement('div');
    const paragraph = document.createElement('p');
    wrapper.appendChild(paragraph);
    template.wrap(fixture, wrapper, 'p');
    assert.equal(fixture.childNodes.length, 1);
    assert.equal(fixture.childNodes[0], wrapper);
    assert.equal(text.parentNode, paragraph);
  });

  it("can find and replace elements in a template", () => {
    const fixture = document.createElement('template');
    fixture.innerHTML = `<div>Hello</div><div>World</div>`;
    template.findAndTransmute(fixture, 'div', 'p');
    assert.equal(fixture.innerHTML, `<p>Hello</p><p>World</p>`);
  });

  it("supports an element with a role during initial rendering", async () => {
    const fixture = new DynamicSingle();
    fixture.render();
    assert(fixture.$.static instanceof HTMLDivElement);
    assert(fixture.$.dynamic instanceof HTMLButtonElement);
    assert.equal(fixture.$.dynamic.getAttribute('id'), 'dynamic');
    assert.equal(fixture.$.dynamic.textContent, 'This element changes');
    assert(fixture.$.dynamic.classList.contains('foo'));
  });

  it("lets an element change a role after initial rendering", async () => {
    const fixture = new DynamicSingle();
    fixture.render();
    assert(fixture.$.static instanceof HTMLDivElement);
    assert(fixture.$.dynamic instanceof HTMLButtonElement);
    fixture.setState({
      dynamicRole: 'a'
    });
    fixture.render();
    assert(fixture.$.dynamic instanceof HTMLAnchorElement);
    assert.equal(fixture.$.dynamic.getAttribute('id'), 'dynamic');
    assert.equal(fixture.$.dynamic.textContent, 'This element changes');
    assert(fixture.$.dynamic.classList.contains('foo'));
  });

  it("supports an element with a role applied to multiple elements", async () => {
    const fixture = new DynamicMultiple();
    fixture.render();
    assert(fixture.$.static instanceof HTMLDivElement);
    fixture.shadowRoot.querySelectorAll('.dynamic').forEach(element => {
      assert(element instanceof HTMLButtonElement);
      assert(element.classList.contains('foo'));
    });
  });

});
