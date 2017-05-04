import { assert } from 'chai';
import SingleSelectionMixin from '../../mixins/SingleSelectionMixin.js';
import SelectedItemTextValueMixin from '../../mixins/SelectedItemTextValueMixin.js';


/* Element that exposes a value property */
class ElementWithValue extends SelectedItemTextValueMixin(SingleSelectionMixin(HTMLElement)) {
  get items() {
    if (!this._items) {
      const strings = ['One', 'Two', 'Three'];
      this._items = strings.map(string => {
        const item = document.createElement('div');
        item.textContent = string;
        return item;
      });
    }
    return this._items;
  }
}
customElements.define('element-with-value', ElementWithValue);


describe("SelectedItemTextValueMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("returns the empty string for no selection", () => {
    const fixture = document.createElement('element-with-value');
    assert.equal(fixture.selectedItem, null);
    assert.equal(fixture.value, '');
  });

  it("returns the text of the selected item", () => {
    const fixture = document.createElement('element-with-value');
    fixture.selectedIndex = 0;
    assert.equal(fixture.value, 'One');
  });

  it("can set the selectedItem that has the indicated text", () => {
    const fixture = document.createElement('element-with-value');
    fixture.value = 'Two';
    assert.equal(fixture.selectedIndex, 1);
  });

  it("sets selectedItem to null if indicated text isn't found", () => {
    const fixture = document.createElement('element-with-value');
    fixture.selectedIndex = 0;
    fixture.value = 'foo';
    assert.equal(fixture.selectedItem, null);
  });

});
