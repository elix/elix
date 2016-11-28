import { assert } from 'chai';
import SimpleAttribute from '../src/SimpleAttribute';


class SimpleAttributeTest extends SimpleAttribute(HTMLElement) {
  get template() {
    return `
      <style>
      :host {
        display: inline-block;
      }

      :host([generic=""]) {
        display: block;
      }
      </style>
      <template>
        <slot></slot>
      </template>
    `;
  }
}
customElements.define('simple-attribute-test', SimpleAttributeTest);


describe("SimpleAttribute mixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("can be instantiated", () => {
    const fixture = document.createElement('simple-attribute-test');
    container.appendChild(fixture);
    assert(fixture);
  });
});