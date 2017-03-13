import { assert } from 'chai';
import KeyboardPagedSelectionMixin from '../src/KeyboardPagedSelectionMixin';
import symbols from '../src/symbols';


const itemHeight = '100';

class KeyboardPagedSelectionTest extends KeyboardPagedSelectionMixin(HTMLElement) {

  get items() {
    return this.children;
  }

  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(index) {
    this._selectedIndex = index;
  }

}
customElements.define('keyboard-paged-selection-test', KeyboardPagedSelectionTest);


describe("KeyboardPagedSelectionMixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("If bottom item not selected, Page Down selects bottom item", () => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.selectedIndex = 0;
    const handled = fixture[symbols.keydown]({
      keyCode: 34
    });
    assert(handled);
    assert.equal(fixture.selectedIndex, 1);
  });

  it("If bottom item selected, Page Down advances selection by one page", () => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.selectedIndex = 1;
    const handled = fixture[symbols.keydown]({
      keyCode: 34
    });
    assert(handled);
    assert.equal(fixture.selectedIndex, 3);
  });

  it("If less than one page remaining, Page Down selects last item", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.selectedIndex = 3;
    fixture.addEventListener('scroll', () => {
      const handled = fixture[symbols.keydown]({
        keyCode: 34
      });
      assert(handled);
      assert.equal(fixture.selectedIndex, 4);
      done();
    });
    fixture.scrollTop = 2 * itemHeight; // So index 2 is at top of viewport.
  });

  it("If last item already selected, Page Down has no effect", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.selectedIndex = 4;
    fixture.addEventListener('scroll', () => {
      const handled = fixture[symbols.keydown]({
        keyCode: 34
      });
      assert(!handled);
      done();
    });
    fixture.scrollTop = 3 * itemHeight; // So index 3 is at top of viewport.
  });

});


function createSampleElement() {

  const fixture = document.createElement('keyboard-paged-selection-test');

  // Force scroll: make element only tall enough to show 2 items at a time.
  const itemsToShow = 2;
  fixture.style.display = 'block';
  fixture.style.height = `${itemsToShow * itemHeight}px`;
  fixture.style.overflowY = 'auto';

  // Add items.
  ['Zero', 'One', 'Two', 'Three', 'Four'].forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.height = `${itemHeight}px`;
    fixture.appendChild(div);
  });
  return fixture;
}
