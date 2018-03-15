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

  it("creates proxies for each item", async () => {
    const fixture = new Explorer();
    fixture.proxyTag = 'proxy-test';
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
    const proxies = fixture.proxies;
    assert.equal(proxies.length, 3);
    const item = fixture.items[0];
    const proxy = proxies[0];
    assert.equal(proxy.item, item);
  });

});
