import * as content from '../../src/content.js';
import * as internal from '../../src/internal.js';
import * as template from '../../src/template.js';
import ShadowTemplateMixin from '../../src/ShadowTemplateMixin.js';


/*
 * Simple element with a slot.
 */
class ChildrenTest extends ShadowTemplateMixin(HTMLElement) {
  [internal.template]() {
    return template.html`
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
  [internal.template]() {
    return template.html`<children-test><slot></slot></children-test>`;
  }
}
customElements.define('redistribution-test', RedistributionTest);


describe("content helpers", () => {

  it("can return the substantive elements in a list", () => {
    const fixture = document.createElement('div');
    fixture.innerHTML = `
      <div>0</div>
      <link>
      <script></script>
      <style></style>
      <template></template>
      <div>1</div>
    `;
    const filtered = content.substantiveElements(fixture.childNodes);
    assert.equal(filtered.length, 2);
    assert.equal(filtered[0].textContent, '0');
    assert.equal(filtered[1].textContent, '1');
  });

});
