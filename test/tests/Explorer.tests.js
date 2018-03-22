import ElementBase from '../../src/ElementBase.js';
import Explorer from '../../src/Explorer.js';
import flushPolyfills from '../flushPolyfills.js';
import * as symbols from '../../src/symbols.js'


const itemKey = Symbol('item');
class ProxyTest extends ElementBase {

  get item() {
    return this[itemKey];
  }
  set item(item) {
    this[itemKey] = item;
  }

  get [symbols.template]() {
    return `<slot></slot>`;
  }
  
}
customElements.define('proxy-test', ProxyTest);


describe("Explorer", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("creates default proxies for each item", async () => {
    const fixture = new Explorer();
    fixture.proxyTag = 'proxy-test';
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
    const items = fixture.items;
    assert.equal(proxies.length, 3);
    assert.equal(proxies[0].item, items[0]);
  });

  it("associates slotted proxies with each item", async () => {
    const fixture = new Explorer();
    fixture.innerHTML = `
      <proxy-test slot="proxy">Proxy one</proxy-test>
      <proxy-test slot="proxy">Proxy two</proxy-test>
      <proxy-test slot="proxy">Proxy three</proxy-test>
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
    const items = fixture.items;
    assert.equal(proxies.length, 3);
    assert.equal(proxies[0].item, items[0]);
  });

});
