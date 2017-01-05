import { assert } from 'chai';
import SimpleAttributeMixin from '../src/SimpleAttributeMixin';


class SimpleAttributeTest extends SimpleAttributeMixin(HTMLElement) {
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


describe("SimpleAttributeMixin", function() {

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
