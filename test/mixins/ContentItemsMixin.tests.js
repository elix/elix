import { assert } from 'chai';
import ContentItemsMixin from '../../mixins/ContentItemsMixin.js';
import symbols from '../../mixins/symbols.js';


class ContentItemsTest extends ContentItemsMixin(HTMLElement) {

  itemProps(item, index, original) {
    return {
      hidden: index % 2 === 0
    };
  }

  get state() {
    return {
      content: this.children
    };
  }

}
customElements.define('content-items-test', ContentItemsTest);


describe("ContentItemsMixin", () => {

  it("returns contents as items", () => {
    const fixture = new ContentItemsTest();
    fixture.innerHTML = `
      <div>1</div>
      <div>2</div>
    `;
    const items = fixture.items;
    assert.equal(items.length, 2);
    assert.equal(items[0].textContent, '1');
    assert.equal(items[1].textContent, '2');
  });

  it("renders itemProps to items", () => {
    const fixture = new ContentItemsTest();
    fixture.innerHTML = `
      <div>1</div>
      <div>2</div>
      <div>3</div>
    `;
    fixture[symbols.render]();
    assert(fixture.items[0].hidden);
    assert(!fixture.items[1].hidden);
    assert(fixture.items[2].hidden);;
  });

});
