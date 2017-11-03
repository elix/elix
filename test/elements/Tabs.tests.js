import flushPolyfills from '../flushPolyfills.js';
// @ts-ignore
import Tabs from '../../elements/Tabs.js'; // eslint-disable-line no-unused-vars


describe("Tabs", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  // Marked as skip because it won't pass in polyfill.
  // When Tabs calls renderArrayAsElements, the shadowRoot should
  // contains a slot named "tabButtons", but does not. Unclear whether this is a
  // new polyfill bug, or caused by one of the ones we've already filed.
  it("creates tab buttons for each tab panel", async () => {
    const fixture = new Tabs();
    fixture.innerHTML = `
      <div aria-label="Label one">Page one</div>
      <div aria-label="Label two">Page two</div>
      <div aria-label="Label three">Page three</div>
    `;
    container.appendChild(fixture);
    // Wait for content.
    flushPolyfills();
    await Promise.resolve();
    fixture.render();
    const tabButtons = fixture.tabButtons;
    assert.equal(tabButtons.length, 3);
    const tabButton = tabButtons[0];
    const tabPanel = fixture.items[0];
    assert.equal(tabButton.getAttribute('aria-controls'), tabPanel.id);
    assert.equal(tabPanel.getAttribute('aria-labelledby'), tabButton.id);
  });

});
