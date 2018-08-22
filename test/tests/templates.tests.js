import { createElement, html, replace } from '../../src/template.js';


class TemplateTest extends HTMLElement {}
customElements.define('template-test', TemplateTest);


describe("templates", () => {

  it("html template function returns an HTMLTemplateElement", () => {
    const fixture = html`<div>Hello</div>`;
    assert(fixture instanceof HTMLTemplateElement);
  });

  it("can create an element from a string descriptor", () => {
    const fixture = createElement('div');
    assert(fixture instanceof HTMLDivElement);
  });

  it("can create an element from a class constructor", () => {
    const fixture = createElement(TemplateTest);
    assert(fixture instanceof TemplateTest);
  });

  it("can create an element by cloning an element", () => {
    const original = document.createElement('div');
    original.textContent = 'Hello';
    const fixture = createElement(original);
    assert(fixture instanceof HTMLDivElement);
    assert.equal(fixture.textContent, 'Hello');
    fixture.textContent = 'Goodbye';
    assert.equal(original.textContent, 'Hello'); // I.e., unaffected
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
    replace(original, replacement);
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

});
