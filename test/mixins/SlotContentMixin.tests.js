import flushPolyfills from '../../test/flushPolyfills.js';
import SlotContentMixin from '../../mixins/SlotContentMixin.js';
import symbols from '../../mixins/symbols.js';

  
// Hack to avoid failing test on ie11
// https://stackoverflow.com/questions/21825157/internet-explorer-11-detection
const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;


/*
 * Simple element using the SlotContentMixin mixin.
 */
class SlotContentTest extends SlotContentMixin(HTMLElement) {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div id="static">This is static content</div>
      <slot></slot>
    `;
    this.state = this.defaultState;
    this[symbols.shadowCreated]();
  }

  setState(state) {
    Object.assign(this.state, state);
  }

}
customElements.define('slot-content-test', SlotContentTest);


/*
 * Element wrapping an instance of the above, so we can test detection of
 * changes in final distribution (not just direct slot assignments).
 */
class WrappedContentTest extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<slot-content-test><slot></slot></default-slotcontent-test>`;
  }
}
customElements.define('wrapped-slot-content-test', WrappedContentTest);


describe("SlotContentMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("uses the component's default slot as the default slot for content", async () => {
    const fixture = document.createElement('slot-content-test');
    // Wait for initial content.
    flushPolyfills();
    await Promise.resolve();
    const slot = fixture.shadowRoot.children[1];
    assert.equal(fixture.contentSlot, slot);
  });

  it("returns direct assigned nodes as content", async () => {
    const fixture = document.createElement('slot-content-test');
    fixture.innerHTML = `<div>One</div><div>Two</div><div>Three</div>`;
    // Wait for initial content.
    flushPolyfills();
    await Promise.resolve();
    assert.equal(fixture.state.content.length, 3);
  });

  if (!isIE11) {
    it("returns distributed nodes as content", async () => {
      const wrapper = document.createElement('wrapped-slot-content-test');
      wrapper.innerHTML = `<div>One</div><div>Two</div><div>Three</div>`;
      flushPolyfills();
      const fixture = wrapper.shadowRoot.querySelector('slot-content-test');
      // Wait for initial content.
      flushPolyfills();
      await Promise.resolve();
      assert.equal(fixture.state.content.length, 3);
    });
  } else {
    it.skip("returns distributed nodes as content [skip in IE 11]");
  }

  if (!isIE11) {
    it("sets content when defined component is parsed", async () => {
      container.innerHTML = `<slot-content-test>beaver</slot-content-test>`;
      const fixture = container.querySelector('slot-content-test');
      // Wait for initial content.
      flushPolyfills();
      await Promise.resolve();
      assert.equal(fixture.state.content[0].textContent, 'beaver');
    });
  } else {
    it.skip("sets content when defined component is parsed [skip in IE 11]");
  }

  it("updates content when textContent changes", async () => {
    const fixture = document.createElement('slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    fixture.textContent = 'chihuahua';
    // Wait for slotchange event to be processed.
    flushPolyfills();
    await Promise.resolve();
    assert.equal(fixture.state.content[0].textContent, 'chihuahua');
  });

  it("updates content when children change", async () => {
    const fixture = document.createElement('slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    fixture.contentChangedCallCount = 0;
    const div = document.createElement('div');
    div.textContent = 'dingo';
    fixture.appendChild(div);
    // Wait for slotchange event to be processed.
    flushPolyfills();
    await Promise.resolve();
    assert.equal(fixture.state.content[0].textContent, 'dingo');
  });

  if (!isIE11) {
    it("updates content when redistributed content changes", async () => {
      const wrapper = document.createElement('wrapped-slot-content-test');
      const fixture = wrapper.shadowRoot.querySelector('slot-content-test');
      container.appendChild(wrapper);
      // Wait for initial content.
      flushPolyfills();
      fixture.contentChangedCallCount = 0;
      wrapper.textContent = 'echidna';
      // Wait for slotchange event to be processed.
      flushPolyfills();
      await Promise.resolve();
      assert.equal(fixture.state.content[0].textContent, 'echidna');
    });
  } else {
    it.skip("updates content when redistributed content changes [skip in IE 11]");
  }

  it("doesn't update content for changes in the component's shadow tree", async () => {
    const fixture = document.createElement('slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    await Promise.resolve();

    const previousContent = fixture.state.content;

    // Modify an element in the shadow, which shouldn't trigger contentChanged.
    // Since contentChanged uses MutationObservers, and those only monitor light
    // DOM content, this is not an issue on Shadow DOM. But under the polyfill,
    // the mutation handler will need to filter out mutations that occur in
    // Shady DOM elements.
    const shadowElement = fixture.shadowRoot.querySelector('#static');
    shadowElement.textContent = "This should be ignored";

    flushPolyfills();
    await Promise.resolve();
    assert.equal(fixture.state.content, previousContent);

    // Now add an element to the light DOM, which we *do* expect to trigger
    // contentChanged. Use a timeout to ensure that contentChanged has had a
    // chance to pick up (and ignore)the DOM mutation above.
    fixture.textContent = 'fox';

    // Wait for slotchange event to be processed.
    flushPolyfills();
    await Promise.resolve();
    assert.notEqual(fixture.state.content, previousContent);
    assert.equal(fixture.state.content[0].textContent, 'fox');
  });

  it("doesn't call contentChanged when node is removed from shadow DOM", async () => {
    const fixture = document.createElement('slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    await Promise.resolve();
    const previousContent = fixture.state.content;

    // Remove an element from the shadow, which shouldn't trigger contentChanged.
    const shadowElement = fixture.shadowRoot.querySelector('#static');
    shadowElement.parentNode.removeChild(shadowElement);

    flushPolyfills();
    await Promise.resolve();

    assert.equal(fixture.state.content, previousContent);

    // Now add an element to the light DOM, which we do expect to trigger
    // contentChanged.
    fixture.textContent = 'gorilla';

    // Wait for slotchange event to be processed.
    flushPolyfills();
    await Promise.resolve();

    assert.notEqual(fixture.state.content, previousContent);
    assert.equal(fixture.state.content[0].textContent, 'gorilla');
  });

  it("updates content if node is removed from light DOM", async () => {
    const fixture = document.createElement('slot-content-test');
    const div = document.createElement('div');
    div.textContent = 'hippopotamus';
    fixture.appendChild(div);
    container.appendChild(fixture);
    // Wait for initial content and for first
    // slotchange event to be processed.
    flushPolyfills();

    // Remove a light DOM child, which should trigger content update.
    fixture.removeChild(div);

    // Wait for second slotchange event to be processed.
    flushPolyfills();
    await Promise.resolve();
    assert.equal(fixture.state.content.length, 0);
  });

});
