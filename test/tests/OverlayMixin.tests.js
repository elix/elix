import { merge } from '../../src/updates.js';
import OpenCloseMixin from '../../src/OpenCloseMixin.js';
import OriginalAttributesMixin from '../../src/OriginalAttributesMixin.js'
import OverlayMixin from '../../src/OverlayMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';


const Base =
  OriginalAttributesMixin(
  OpenCloseMixin(
  OverlayMixin(
  ReactiveMixin(
    HTMLElement
  ))));

class OverlayTest extends Base {
  get updates() {
    return merge(super.updates, {
      attributes: {
        tabindex: '0'
      }
    });
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
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    await fixture.open();
    // Mocha test runner has element with z-index of 1, so we expect the
    // overlay to get a default z-index of 2.
    assert.equal(fixture.style.zIndex, '2');
  });

  it('leaves the z-index alone if one is specified', async () => {
    const fixture = document.createElement('overlay-test');
    fixture.style.zIndex = 10;
    container.appendChild(fixture);
    await fixture.open();
    assert.equal(fixture.style.zIndex, '10');
  });

  it('gives overlay focus when opened, restores focus to previous element when closed', async () => {
    const fixture = document.createElement('overlay-test');
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
