import { assert } from 'chai';
import ClickSelectionMixin from '../src/ClickSelectionMixin';
import * as mockInteractions from '../../../test/mockInteractions';

class ClickSelectionTest extends ClickSelectionMixin(HTMLElement) {

  get items() {
    return this.children;
  }

  get selectedItem() {
    return this._selectedItem || null;
  }
  set selectedItem(item) {
    this._selectedItem = item;
  }

}
customElements.define('click-selection-test', ClickSelectionTest);


describe("ClickSelectionMixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("sets the clicked item as the selected item", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture.selectedItem, null);
    const item = fixture.items[0];
    fixture.addEventListener('mousedown', () => {
      assert.equal(fixture.selectedItem, item);
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, 'mousedown');
  });
});


function createSampleElement() {
  const fixture = document.createElement('click-selection-test');
  ['Zero', 'One', 'Two'].forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    fixture.appendChild(div);
  });
  return fixture;
}