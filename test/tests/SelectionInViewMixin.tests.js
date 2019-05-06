import ReactiveMixin from '../../src/ReactiveMixin.js';
import SelectionInViewMixin from '../../src/SelectionInViewMixin.js';

const itemHeight = '100';

class SelectionInViewTest extends SelectionInViewMixin(ReactiveMixin(HTMLElement)) {

  get defaultState() {
    return Object.assign(super.defaultState, {
      selectedIndex: -1
    });
  }

  get items() {
    return Array.prototype.slice.call(this.children);
  }

}
customElements.define('selection-in-view-test', SelectionInViewTest);


describe("SelectionInViewMixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("Scrolls down to bring item clipped by bottom edge fully into view", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.addEventListener('scroll', () => {
      // Just check that styles are applied, not really part of testing the fixture.
      assert.equal(fixture.style.height, '150px');
      assert.equal(fixture.scrollTop, 50);
      done();
    });
    fixture.setState({ selectedIndex: 1 });
  });

  it("Scrolls down to bring item below bottom edge fully into view", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.addEventListener('scroll', () => {
      assert.equal(fixture.scrollTop, 150);
      done();
    });
    fixture.setState({ selectedIndex: 2 });
  });

  it("Scrolls up to bring item above top edge fully into view", done => {
    const fixture = createSampleElement();
    container.appendChild(fixture);
    fixture.scrollTop = 150; // Scrolled all the way to bottom.
    fixture.addEventListener('scroll', () => {
      assert.equal(fixture.scrollTop, 0);
      done();
    });
    fixture.setState({ selectedIndex: 0 });
  });

});


function createSampleElement() {

  const fixture = document.createElement('selection-in-view-test');

  // Force scroll: make element only tall enough to show 1.5 items at a time.
  const itemsToShow = 1.5;
  fixture.style.display = 'block';
  fixture.style.height = `${itemsToShow * itemHeight}px`;
  fixture.style.overflowY = 'auto';

  // Add items.
  ['Zero', 'One', 'Two'].forEach(text => {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.height = `${itemHeight}px`;
    fixture.appendChild(div);
  });
  return fixture;
}
