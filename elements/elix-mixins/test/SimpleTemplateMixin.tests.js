import { assert } from 'chai';
import SimpleTemplateMixin from '../src/SimpleTemplateMixin';


class SimpleTemplateTest extends SimpleTemplateMixin(HTMLElement) {
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


describe("SimpleTemplateMixin", function() {

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