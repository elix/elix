import * as symbols from '../../src/symbols.js';
import OpenCloseMixin from '../../src/OpenCloseMixin.js';
import OverlayMixin from '../../src/OverlayMixin.js';
import ReactiveElement from '../../src/ReactiveElement.js';


const Base =
  OpenCloseMixin(
  OverlayMixin(
    ReactiveElement
  ));

class OverlayTest extends Base {
  [symbols.render](changed) {
    if (super[symbols.render]) { super[symbols.render](changed); }
    this.tabIndex = 0;
  }
}
customElements.define('overlay-test', OverlayTest);


describe("OverlayMixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it('sets a default z-index', async () => {
    const fixture = new OverlayTest();
    container.appendChild(fixture);
    await fixture.open();
    // Mocha test runner has element with z-index of 1, so we expect the
    // overlay to get a default z-index of 2.
    assert.equal(fixture.style.zIndex, '2');
  });

  it('leaves the z-index alone if one is specified', async () => {
    const fixture = new OverlayTest();
    fixture.style.zIndex = 10;
    container.appendChild(fixture);
    await fixture.open();
    assert.equal(fixture.style.zIndex, '10');
  });

  it('gives overlay focus when opened, restores focus to previous element when closed', async () => {
    const fixture = new OverlayTest();
    container.appendChild(fixture);
    const input = document.createElement('input');
    container.appendChild(input);
    input.focus();
    assert.equal(document.activeElement, input);
    await fixture.open();
    assert.equal(document.activeElement, fixture);
    await fixture.close();
    assert.equal(document.activeElement, input);
  });

});
