import * as symbols from '../../src/symbols.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';


class ContentItemsTest extends ContentItemsMixin(ReactiveMixin(HTMLElement)) {
  
  itemCalcs(item, index) {
    const base = super.itemCalcs ? super.itemCalcs(item, index) : null;
    return Object.assign({}, base, {
      even: index % 2 === 0
    });
  }
  
  /* eslint-disable no-unused-vars */
  itemUpdates(item, calcs, original) {
    return {
      hidden: calcs.even
    };
  }

  // Force an update of state.
  // Normally this would be handled automatically, e.g., via SlotContentMixin.
  updateContent() {
    // Copy content.
    // Use Array.slice because polyfill (no longer) seems to provide expected
    // API on this.children.
    const content = Array.prototype.slice.call(this.children, 0);
    this.setState({ content });
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
    fixture.updateContent();
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
    fixture.updateContent();
    const items = fixture.items;
    assert.equal(fixture.itemCalcs(items[0], 0).index, 0);
    assert.equal(fixture.itemCalcs(items[1], 1).index, 1);
    assert.equal(fixture.itemCalcs(items[2], 2).index, 2);
  });

  it("renders itemUpdates to items", () => {
    const fixture = new ContentItemsTest();
    fixture.innerHTML = `
      <div>1</div>
      <div>2</div>
      <div>3</div>
    `;
    fixture.updateContent();
    fixture[symbols.render]();
    assert(fixture.items[0].hidden);
    assert(!fixture.items[1].hidden);
    assert(fixture.items[2].hidden);
  });

});
