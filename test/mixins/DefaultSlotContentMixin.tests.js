import DefaultSlotContentMixin from '../../mixins/DefaultSlotContentMixin.js';
import flushPolyfills from '../../test/flushPolyfills.js';
import symbols from '../../mixins/symbols.js';

  
// Hack to avoid failing test on ie11
// https://stackoverflow.com/questions/21825157/internet-explorer-11-detection
const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;


/*
 * Simple element using the DefaultSlotContentMixin mixin.
 */
class DefaultSlotContentTest extends DefaultSlotContentMixin(HTMLElement) {

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
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
customElements.define('default-slot-content-test', DefaultSlotContentTest);


/*
 * Element wrapping an instance of the above, so we can test detection of
 * changes in final distribution (not just direct slot assignments).
 */
class WrappedContentTest extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<default-slot-content-test><slot></slot></default-slotcontent-test>`;
  }
}
customElements.define('wrapped-default-slot-content-test', WrappedContentTest);


describe("DefaultSlotContentMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("returns direct assigned nodes as content", done => {
    const fixture = document.createElement('default-slot-content-test');
    fixture.innerHTML = `<div>One</div><div>Two</div><div>Three</div>`;
    // Wait for initial content.
    flushPolyfills();
    setTimeout(() => {
      assert.equal(fixture.state.content.length, 3);
      done();
    });
  });

  if (!isIE11) {
    it("returns distributed nodes as content", done => {
      const wrapper = document.createElement('wrapped-default-slot-content-test');
      wrapper.innerHTML = `<div>One</div><div>Two</div><div>Three</div>`;
      flushPolyfills();
      const fixture = wrapper.shadowRoot.querySelector('default-slot-content-test');
      // Wait for initial content.
      flushPolyfills();
      setTimeout(() => {
        assert.equal(fixture.state.content.length, 3);
        done();
      });
    });
  } else {
    it.skip("returns distributed nodes as content [skip in IE 11]");
  }

  if (!isIE11) {
    it("sets content when defined component is parsed", done => {
      container.innerHTML = `<default-slot-content-test>beaver</default-slot-content-test>`;
      const fixture = container.querySelector('default-slot-content-test');
      // Wait for initial content.
      flushPolyfills();
      setTimeout(() => {
        assert.equal(fixture.state.content[0].textContent, 'beaver');
        done();
      });
    });
  } else {
    it.skip("sets content when defined component is parsed [skip in IE 11]");
  }

  it("updates content when textContent changes", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    fixture.textContent = 'chihuahua';
    // Wait for slotchange event to be processed.
    flushPolyfills();
    setTimeout(() => {
      assert.equal(fixture.state.content[0].textContent, 'chihuahua');
      done();
    });
  });

  it("updates content when children change", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    fixture.contentChangedCallCount = 0;
    const div = document.createElement('div');
    div.textContent = 'dingo';
    fixture.appendChild(div);
    // Wait for slotchange event to be processed.
    flushPolyfills();
    setTimeout(() => {
      assert.equal(fixture.state.content[0].textContent, 'dingo');
      done();
    });
  });

  if (!isIE11) {
    it("updates content when redistributed content changes", done => {
      const wrapper = document.createElement('wrapped-default-slot-content-test');
      const fixture = wrapper.shadowRoot.querySelector('default-slot-content-test');
      container.appendChild(wrapper);
      // Wait for initial content.
      flushPolyfills();
      fixture.contentChangedCallCount = 0;
      wrapper.textContent = 'echidna';
      // Wait for slotchange event to be processed.
      flushPolyfills();
      setTimeout(() => {
        assert.equal(fixture.state.content[0].textContent, 'echidna');
        done();
      });
    });
  } else {
    it.skip("updates content when redistributed content changes [skip in IE 11]");
  }

  it("doesn't update content for changes in the component's shadow tree", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    setTimeout(() => {
      const previousContent = fixture.state.content;

      // Modify an element in the shadow, which shouldn't trigger contentChanged.
      // Since contentChanged uses MutationObservers, and those only monitor light
      // DOM content, this is not an issue on Shadow DOM. But under the polyfill,
      // the mutation handler will need to filter out mutations that occur in
      // Shady DOM elements.
      const shadowElement = fixture.shadowRoot.querySelector('#static');
      shadowElement.textContent = "This should be ignored";

      flushPolyfills();
      setTimeout(() => {
        assert.equal(fixture.state.content, previousContent);

        // Now add an element to the light DOM, which we *do* expect to trigger
        // contentChanged. Use a timeout to ensure that contentChanged has had a
        // chance to pick up (and ignore)the DOM mutation above.
        fixture.textContent = 'fox';

        // Wait for slotchange event to be processed.
        flushPolyfills();
        setTimeout(() => {
          assert.notEqual(fixture.state.content, previousContent);
          assert.equal(fixture.state.content[0].textContent, 'fox');
          done();
        });
      });
    });
  });

  it("doesn't call contentChanged when node is removed from shadow DOM", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    setTimeout(() => {
      const previousContent = fixture.state.content;

      // Remove an element from the shadow, which shouldn't trigger contentChanged.
      const shadowElement = fixture.shadowRoot.querySelector('#static');
      shadowElement.parentNode.removeChild(shadowElement);

      flushPolyfills();
      setTimeout(() => {
        assert.equal(fixture.state.content, previousContent);

        // Now add an element to the light DOM, which we do expect to trigger
        // contentChanged.
        fixture.textContent = 'gorilla';

        // Wait for slotchange event to be processed.
        flushPolyfills();
        setTimeout(() => {
          assert.notEqual(fixture.state.content, previousContent);
          assert.equal(fixture.state.content[0].textContent, 'gorilla');
          done();
        });
      });
    });
  });

  it("updates content if node is removed from light DOM", done => {
    const fixture = document.createElement('default-slot-content-test');
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
    setTimeout(() => {
      assert.equal(fixture.state.content.length, 0);
      done();
    });
  });

});
