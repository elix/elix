import { assert } from 'chai';
import * as content from '../src/content';
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

  it("can return the substantive elements in a list", function() {
    const fixture = document.createElement('div');
    fixture.innerHTML = `
      <div>1</div>
      <link>
      <script></script>
      <style></style>
      <template></template>
      <div>2</div>
    `;
    const filtered = content.substantiveElements(fixture.childNodes);
    assert.equal(filtered.length, 2);
    assert.equal(filtered[0].textContent, '1');
    assert.equal(filtered[1].textContent, '2');
  });

});
