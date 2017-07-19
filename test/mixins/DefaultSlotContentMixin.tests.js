import { assert } from 'chai';
import DefaultSlotContentMixin from '../../mixins/DefaultSlotContentMixin.js';
import flushPolyfills from '../../test/flushPolyfills.js';
import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin.js';
import symbols from '../../mixins/symbols.js';


/*
 * Simple element using the DefaultSlotContentMixin mixin.
 */
class DefaultSlotContentTest extends DefaultSlotContentMixin(ShadowTemplateMixin(HTMLElement)) {

  constructor() {
    super();
    this.contentChangedCallCount = 0;
  }

  // We define our own call-counting logic here instead of using Sinon because
  // the polyfill won't let us attach spies to this method on an un-upgraded
  // element, and by the time the element's upgraded, this method will have
  // already fired.
  [symbols.contentChanged]() {
    if (super[symbols.contentChanged]) { super[symbols.contentChanged](); }
    this.contentChangedCallCount++;
  }

  [symbols.template]() {
    return `
      <div id="static">This is static content</div>
      <slot></slot>
    `;
  }

}
customElements.define('default-slot-content-test', DefaultSlotContentTest);


/*
 * Element wrapping an instance of the above, so we can test detection of
 * changes in final distribution (not just direct slot assignments).
 */
class WrappedContentTest extends ShadowTemplateMixin(HTMLElement) {
  [symbols.template]() {
    return `<default-slot-content-test><slot></slot></default-slotcontent-test>`;
  }
}
customElements.define('wrapped-default-slot-content-test', WrappedContentTest);


describe("DefaultSlotContentMixin", () => {

  let container;
  // Hack to avoid failing test on ie11
  // https://stackoverflow.com/questions/21825157/internet-explorer-11-detection
  let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("returns direct assigned nodes as content", () => {
    const fixture = document.createElement('default-slot-content-test');
    fixture.innerHTML = `<div>One</div><div>Two</div><div>Three</div>`;
    flushPolyfills();
    assert.equal(fixture[symbols.content].length, 3);
  });

  if (!isIE11) {
    it("returns distributed nodes as content", () => {
      const wrapper = document.createElement('wrapped-default-slot-content-test');
      wrapper.innerHTML = `<div>One</div><div>Two</div><div>Three</div>`;
      flushPolyfills();
      const fixture = wrapper.shadowRoot.querySelector('default-slot-content-test');
      assert.equal(fixture[symbols.content].length, 3);
    });
  }
  else {
    it.skip("returns distributed nodes as content");
  }

  if (!isIE11) {
    it("makes initial call to contentChanged when component is created", done => {
      container.innerHTML = `<default-slot-content-test>beaver</default-slot-content-test>`;
      const fixture = container.querySelector('default-slot-content-test');
      // Wait for initial contentChanged call to complete.
      flushPolyfills();
      setTimeout(() => {
        assert(fixture.contentChangedCallCount === 1);
        done();
      });
    });
  }
  else {
    it.skip("makes initial call to contentChanged when component is created");
  }

  it("calls contentChanged when textContent changes", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial contentChanged call to complete.
    flushPolyfills();
    fixture.contentChangedCallCount = 0;
    fixture.textContent = 'chihuahua';
    // Wait for slotchange event to be processed.
    flushPolyfills();
    setTimeout(() => {
      assert(fixture.contentChangedCallCount === 1);
      done();
    });
  });

  it("calls contentChanged when children change", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial contentChanged call to complete.
    flushPolyfills();
    fixture.contentChangedCallCount = 0;
    const div = document.createElement('div');
    div.textContent = 'dingo';
    fixture.appendChild(div);
    // Wait for slotchange event to be processed.
    flushPolyfills();
    setTimeout(() => {
      assert(fixture.contentChangedCallCount === 1);
      done();
    });
  });

  if (!isIE11) {
    it("calls contentChanged when redistributed content changes", done => {
      const wrapper = document.createElement('wrapped-default-slot-content-test');
      const fixture = wrapper.shadowRoot.querySelector('default-slot-content-test');
      container.appendChild(wrapper);
      // Wait for initial contentChanged call to complete.
      flushPolyfills();
      fixture.contentChangedCallCount = 0;
      wrapper.textContent = 'echidna';
      // Wait for slotchange event to be processed.
      flushPolyfills();
      setTimeout(() => {
        assert(fixture.contentChangedCallCount === 1);
        done();
      });
    });
  }
  else {
    it.skip("calls contentChanged when redistributed content changes");
  }

  it("doesn't call contentChanged for changes in the component's shadow tree", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial contentChanged call to complete.
    flushPolyfills();
    setTimeout(() => {
      fixture.contentChangedCallCount = 0;

      // Modify an element in the shadow, which shouldn't trigger contentChanged.
      // Since contentChanged uses MutationObservers, and those only monitor light
      // DOM content, this is not an issue on Shadow DOM. But under the polyfill,
      // the mutation handler will need to filter out mutations that occur in
      // Shady DOM elements.
      const shadowElement = fixture.shadowRoot.querySelector('#static');
      shadowElement.textContent = "This should be ignored";

      flushPolyfills();
      setTimeout(() => {
        assert(fixture.contentChangedCallCount === 0);

        // Now add an element to the light DOM, which we *do* expect to trigger
        // contentChanged. Use a timeout to ensure that contentChanged has had a
        // chance to pick up (and ignore)the DOM mutation above.
        fixture.textContent = 'fox';

        // Wait for slotchange event to be processed.
        flushPolyfills();
        setTimeout(() => {
          assert(fixture.contentChangedCallCount === 1);
          done();
        });
      });
    });
  });

  it("doesn't call contentChanged when node is removed from shadow DOM", done => {
    const fixture = document.createElement('default-slot-content-test');
    container.appendChild(fixture);
    // Wait for initial contentChanged call to complete.
    flushPolyfills();
    setTimeout(() => {
      fixture.contentChangedCallCount = 0;

      // Remove an element from the shadow, which shouldn't trigger contentChanged.
      const shadowElement = fixture.shadowRoot.querySelector('#static');
      shadowElement.parentNode.removeChild(shadowElement);

      flushPolyfills();
      setTimeout(() => {
        assert(fixture.contentChangedCallCount === 0);

        // Now add an element to the light DOM, which we do expect to trigger
        // contentChanged.
        fixture.textContent = 'gorilla';

        // Wait for slotchange event to be processed.
        flushPolyfills();
        setTimeout(() => {
          assert(fixture.contentChangedCallCount === 1);
          done();
        });
      });
    });
  });

  it("*does* call contentChanged if node is removed from light DOM", done => {
    const fixture = document.createElement('default-slot-content-test');
    const div = document.createElement('div');
    div.textContent = 'hippopotamus';
    fixture.appendChild(div);
    container.appendChild(fixture);
    // Wait for initial contentChanged call to complete and for first
    // slotchange event to be processed.
    flushPolyfills();
    fixture.contentChangedCallCount = 0;

    // Remove a light DOM child, which should trigger contentChanged.
    fixture.removeChild(div);

    // Wait for second slotchange event to be processed.
    flushPolyfills();
    setTimeout(() => {
      assert(fixture.contentChangedCallCount === 1);
      done();
    });
  });

});