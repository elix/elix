import { merge } from '../../src/updates.js';
import Explorer from '../../src/Explorer.js';
import flushPolyfills from '../flushPolyfills.js';


class ExplorerTest extends Explorer {

  proxyUpdates(proxy, calcs) {
    const base = super.proxyUpdates(proxy, calcs);
    const item = calcs.item;
    const textContent = item.getAttribute('aria-label') || item.alt;
    const defaultProxyUpdates = calcs.isDefaultProxy && {
      textContent
    };
    return merge(
      base,
      defaultProxyUpdates
    );
  }

}
customElements.define('explorer-test', ExplorerTest);


describe("Explorer", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("associates slotted proxies with each item", async () => {
    const fixture = new Explorer();
    fixture.innerHTML = `
      <button slot="proxy">Proxy one</button>
      <button slot="proxy">Proxy two</button>
      <button slot="proxy">Proxy three</button>
      <div aria-label="Label one">Item one</div>
      <div aria-label="Label two">Item two</div>
      <div aria-label="Label three">Item three</div>
    `;
    container.appendChild(fixture);
    // Wait for component to render.
    flushPolyfills();
    // Wait for content, which requires event/timeout timing.
    await new Promise(setTimeout);
    const proxies = fixture.proxies;
    assert.equal(proxies.length, 3);
    assert.equal(proxies[0], fixture.children[0]);
  });

  it("creates default proxies for each item", async () => {
    const fixture = new Explorer();
    fixture.proxyRole = 'button';
    fixture.innerHTML = `
      <div aria-label="Label one">Item one</div>
      <div aria-label="Label two">Item two</div>
      <div aria-label="Label three">Item three</div>
    `;
    container.appendChild(fixture);
    // Wait for component to render.
    flushPolyfills();
    // Wait for content, which requires event/timeout timing.
    await new Promise(setTimeout);
    const proxies = fixture.proxies;
    assert.equal(proxies.length, 3);
    assert(proxies[0] instanceof HTMLButtonElement);
  });

  it("asks component for updates to apply to proxies", async () => {
    const fixture = new ExplorerTest();
    fixture.proxyTag = 'button';
    fixture.innerHTML = `
      <div aria-label="Label one">Item one</div>
      <div aria-label="Label two">Item two</div>
      <div aria-label="Label three">Item three</div>
    `;
    container.appendChild(fixture);
    // Wait for component to render.
    flushPolyfills();
    // Wait for content, which requires event/timeout timing.
    await new Promise(setTimeout);
    assert.equal(fixture.proxies[0].textContent, 'Label one');
    assert.equal(fixture.proxies[1].textContent, 'Label two');
    assert.equal(fixture.proxies[2].textContent, 'Label three');
  });

});
