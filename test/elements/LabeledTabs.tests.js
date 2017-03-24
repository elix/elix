import { assert } from 'chai';
import flushPolyfills from '../flushPolyfills';
import LabeledTabs from '../../elements/LabeledTabs'; // jshint ignore:line


describe("LabeledTabs", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  // Marked as skip because it won't pass in polyfill.
  // When LabeledTabs calls renderArrayAsElements, the shadowRoot should
  // contains a slot named "tabButtons", but does not. Unclear whether this is a
  // new polyfill bug, or caused by one of the ones we've already filed.
  if (!window.ShadyCSS || window.ShadyCSS.nativeShadow) {
    it("creates LabeledTabButton instances for each tab panel", done => {
      const fixture = new LabeledTabs();
      fixture.innerHTML = `
      <div aria-label="Label one">Page one</div>
      <div aria-label="Label two">Page two</div>
      <div aria-label="Label three">Page three</div>
      `;
      container.appendChild(fixture);
      // Wait for initial contentChanged call to complete.
      flushPolyfills();
      setTimeout(() => {
        const tabs = fixture.tabs;
        assert.equal(tabs.length, 3);
        const tabButton = tabs[0];
        const tabPanel = fixture.items[0];
        assert.equal(tabButton.getAttribute('aria-controls'), tabPanel.id);
        assert.equal(tabPanel.getAttribute('aria-labelledby'), tabButton.id);
        done();
      });
    });
  } else {
    it.skip("creates LabeledTabButton instances for each tab panel");
  }

});
