import { assert } from 'chai';
import ContentItemsMixin from '../../mixins//ContentItemsMixin.js';
import symbols from '../../mixins//symbols.js';


class ContentItemsTest extends ContentItemsMixin(HTMLElement) {
  get [symbols.content]() {
    return this.children;
  }
}
customElements.define('content-items-test', ContentItemsTest);


describe("ContentItemsMixin", () => {

  it("returns contents as items", function() {
    const fixture = document.createElement('content-items-test');
    fixture.innerHTML = `
      <div>1</div>
      <div>2</div>
    `;
    const items = fixture.items;
    assert.equal(items.length, 2);
    assert.equal(items[0].textContent, '1');
    assert.equal(items[1].textContent, '2');
  });

});
