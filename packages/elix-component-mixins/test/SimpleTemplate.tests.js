import { assert } from 'chai';
import SimpleTemplate from '../src/SimpleTemplate';


class SimpleTemplateTest extends SimpleTemplate(HTMLElement) {
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
customElements.define('simple-template-test', SimpleTemplateTest);


describe("SimpleTemplate mixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("can be instantiated", () => {
    const fixture = document.createElement('simple-template-test');
    container.appendChild(fixture);
    assert(fixture);
  });
});