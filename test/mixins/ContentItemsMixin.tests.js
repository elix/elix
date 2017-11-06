import ContentItemsMixin from '../../mixins/ContentItemsMixin.js';
import symbols from '../../mixins/symbols.js';


class ContentItemsTest extends ContentItemsMixin(HTMLElement) {

  itemCalcs(item, index) {
    const base = super.itemCalcs ? super.itemCalcs(item, index) : null;
    return Object.assign({}, base, {
      even: index % 2 === 0
    });
  }

  /* eslint-disable no-unused-vars */
  itemProps(item, calcs) {
    return {
      hidden: calcs.even
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

  it("includes item index in itemCalcs", () => {
    const fixture = new ContentItemsTest();
    fixture.innerHTML = `
      <div>1</div>
      <div>2</div>
      <div>3</div>
    `;
    const items = fixture.items;
    assert.equal(fixture.itemCalcs(items[0], 0).index, 0);
    assert.equal(fixture.itemCalcs(items[1], 1).index, 1);
    assert.equal(fixture.itemCalcs(items[2], 2).index, 2);
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
    assert(fixture.items[2].hidden);
  });

});
