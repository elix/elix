import { assert } from 'chai';
import * as content from '../src/content';
import flushPolyfills from '../../../test/flushPolyfills';
import ShadowTemplateMixin from '../src/ShadowTemplateMixin';
import symbols from '../src/symbols';


/*
 * Simple element with a slot.
 */
class ChildrenTest extends ShadowTemplateMixin(HTMLElement) {
  get [symbols.template]() {
    return `
      <div id="static">This is static content</div>
      <slot></slot>
    `;
  }
}
customElements.define('children-test', ChildrenTest);


/*
 * Element containing an instance of the above, so we can test redistribution.
 */
class RedistributionTest extends ShadowTemplateMixin(HTMLElement) {
  get [symbols.template]() {
    return `<children-test><slot></slot></children-test>`;
  }
}
customElements.define('redistribution-test', RedistributionTest);


describe("content helpers", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("provides helpers to access direct children", () => {
    const fixture = document.createElement('children-test');
    const div1 = document.createElement('div');
    const text = document.createTextNode(' ');
    const div2 = document.createElement('div');
    div1.textContent = 'Hello';
    div2.textContent = 'World';
    fixture.appendChild(div1);
    fixture.appendChild(text);
    fixture.appendChild(div2);
    assert.equal(content.assignedTextContent(fixture), 'Hello World');
    assert.equal(content.assignedChildren(fixture).length, 2);
    assert.equal(content.assignedChildNodes(fixture).length, 3);
    assert.equal(content.assignedChildNodes(fixture)[2], div2);
  });

  it("provides helpers to access reprojected children", () => {
    const fixture = document.createElement('redistribution-test');
    const div = document.createElement('div');
    div.textContent = 'aardvark';
    fixture.appendChild(div);
    flushPolyfills();
    assert.equal(content.assignedTextContent(fixture), 'aardvark');
    assert.equal(content.assignedChildren(fixture).length, 1);
    assert.equal(content.assignedChildNodes(fixture).length, 1);
    assert.equal(content.assignedChildNodes(fixture)[0], div);
    // Inner element should report same results.
    const inner = fixture.shadowRoot.querySelector('children-test');
    assert.equal(content.assignedTextContent(inner), 'aardvark');
    assert.equal(content.assignedChildren(inner).length, 1);
    assert.equal(content.assignedChildNodes(inner).length, 1);
    assert.equal(content.assignedChildNodes(inner)[0], div);
  });

  it("can filter invisible auxiliary elements from a list", function() {
    const fixture = document.createElement('div');
    fixture.innerHTML = `
      <div>1</div>
      <link>
      <script></script>
      <style></style>
      <template></template>
      <div>2</div>
    `;
    const filtered = content.filterAuxiliaryElements(fixture.children);
    assert.equal(filtered.length, 2);
    assert.equal(filtered[0].textContent, '1');
    assert.equal(filtered[1].textContent, '2');
  });

});
