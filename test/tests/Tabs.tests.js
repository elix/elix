import flushPolyfills from '../flushPolyfills.js';
// @ts-ignore
import Tabs from '../../src/Tabs.js'; // eslint-disable-line no-unused-vars


describe("Tabs", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  // Polyfill has a bug (https://github.com/webcomponents/shadydom/issues/195)
  // that prevents this test from passing under polyfill.
  if (window.ShadyDOM && window.ShadyDOM.inUse) {
    it.skip("creates tab buttons for each tab panel [skipped in polyfill]");
  } else {
    it("creates tab buttons for each tab panel", async () => {
      const fixture = new Tabs();
      fixture.innerHTML = `
        <div aria-label="Label one">Page one</div>
        <div aria-label="Label two">Page two</div>
        <div aria-label="Label three">Page three</div>
      `;
      container.appendChild(fixture);
      // Wait for component to render.
      flushPolyfills();
      // Wait for content, which requires event/timeout timing.
      await new Promise(setTimeout);
      const tabButtons = fixture.tabButtons;
      assert.equal(tabButtons.length, 3);
      const tabButton = tabButtons[0];
      const tabPanel = fixture.items[0];
      assert.equal(tabButton.getAttribute('aria-controls'), tabPanel.id);
      assert.equal(tabPanel.getAttribute('aria-labelledby'), tabButton.id);
    });
  }

});
