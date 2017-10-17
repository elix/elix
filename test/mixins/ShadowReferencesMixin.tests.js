import flushPolyfills from '../flushPolyfills.js';
import symbols from '../../mixins/symbols.js';
import ShadowReferencesMixin from '../../mixins/ShadowReferencesMixin.js';


/* Element with shadow elements that have `id` attributes. */
class ShadowReferencesTest extends ShadowReferencesMixin(HTMLElement) {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <div id="foo">
        <span id="bar"></span>
      </div>
    `;
    this[symbols.shadowCreated]();
  }
}
customElements.define('shadow-references-test', ShadowReferencesTest);


describe("ShadowReferencesMixin", () => {

  it("generates this.$ references for shadow elements with 'id' attributes", () => {
    const fixture = document.createElement('shadow-references-test');
    flushPolyfills();
    const root = fixture.shadowRoot;
    assert.equal(fixture.$.foo, root.querySelector('#foo'));
    assert.equal(fixture.$.bar, root.querySelector('#bar'));
  });

});
