import flushPolyfills from '../../test/flushPolyfills.js';
import ListBox from '../../elements/ListBox.js';
import * as mockInteractions from '../mockInteractions.js';
import symbols from '../../utilities/symbols.js';


describe("ListBox", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("raises a selected-index-changed event when an item is clicked", async () => {
    const fixture = createSampleListBox();
    container.appendChild(fixture);
    // Wait for initial content.
    flushPolyfills();
    await Promise.resolve();
    assert.equal(fixture.state.selectedIndex, -1);
    const item = fixture.items[0];
    const eventPromise = new Promise(resolve => {
      fixture.addEventListener('selected-index-changed', () => {
        assert.equal(fixture.state.selectedIndex, 0);
        resolve();
      });
    });
    mockInteractions.dispatchSyntheticMouseEvent(item, 'mousedown');
    await eventPromise;
  });

});


function createSampleListBox() {
  const fixture = new ListBox();
  ['Zero', 'One', 'Two'].forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    fixture.appendChild(div);
  });
  return fixture;
}
