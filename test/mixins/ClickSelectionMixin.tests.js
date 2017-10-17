import ClickSelectionMixin from '../../mixins/ClickSelectionMixin.js';
import * as mockInteractions from '../../test/mockInteractions.js';

class ClickSelectionTest extends ClickSelectionMixin(HTMLElement) {

  constructor() {
    super();
    this.state = {
      selectedIndex: -1
    };
  }

  get items() {
    return this.children;
  }

  updateSelectedIndex(selectedIndex) {
    this.state.selectedIndex = selectedIndex;
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
    assert.equal(fixture.state.selectedIndex, -1);
    const item = fixture.items[0];
    fixture.addEventListener('mousedown', () => {
      assert.equal(fixture.state.selectedIndex, 0);
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, 'mousedown');
  });

  it("ignores right clicks", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    assert.equal(fixture.state.selectedIndex, -1);
    const item = fixture.items[0];
    fixture.addEventListener('mousedown', () => {
      assert.equal(fixture.state.selectedIndex, -1, "handled mousedown even when right button was pressed");
      done();
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, 'mousedown', {
      button: 2
    });
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