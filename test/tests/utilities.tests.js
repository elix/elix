import { firstFocusableElement } from '../../src/utilities.js';
import * as template from '../../src/template.js';


describe("utilities", () => {

  it("firstFocusableElement finds first focusable element in light DOM", () => {
    const fixture = template.html`
      <div></div>
      <input tabindex="-1">
      <button disabled>Disabled</button>
      <button id="enabled"></button>
    `;
    const element = firstFocusableElement(fixture.content);
    const button = fixture.content.querySelector('#enabled');
    assert.equal(element, button);
  });

  it("firstFocusableElement finds first focusable element in composed tree", () => {
    const fixture = document.createElement('div');
    const fixtureTemplate = template.html`
      <div></div>
      <slot></slot>
      <button id="enabled"></button>
    `;
    fixture.attachShadow({ mode: 'open' });
    const clone = document.importNode(fixtureTemplate.content, true);
    fixture.shadowRoot.appendChild(clone);
    const input = document.createElement('input');
    fixture.appendChild(input);
    const element = firstFocusableElement(fixture.shadowRoot);
    assert.equal(element, input);
  });

});
