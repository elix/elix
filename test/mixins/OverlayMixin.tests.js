import { merge } from '../../utilities/updates.js';
import OverlayMixin from '../../mixins/OverlayMixin.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';
import RenderUpdatesMixin from '../../mixins/RenderUpdatesMixin.js';
import symbols from '../../utilities/symbols.js';


const Base =
  RenderUpdatesMixin(
  OverlayMixin(
  ReactiveMixin(
    HTMLElement
  )));

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

  it('opens and closes with opened property', () => {
    const fixture = document.createElement('overlay-test');
    assert(!fixture.opened);
    fixture.opened = true;
    assert(fixture.opened);
    fixture.opened = false;
  });

  it('opens and closes with open and close methods', async () => {
    const fixture = document.createElement('overlay-test');
    assert(fixture.closed);
    assert(!fixture.opened);
    await fixture.open();
    assert(!fixture.closed);
    assert(fixture.opened);
    await fixture.close(true);
    assert(fixture.closed);
    assert(!fixture.opened);
  });

  it('invokes openedChanged if defined', () => {
    const fixture = document.createElement('overlay-test');
    fixture[symbols.openedChanged] = (opened) => {
      assert(opened);
    };
    fixture.opened = true;
  });

  it('sets a default z-index', async () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    await fixture.open();
    // Mocha test runner has element with z-index of 1, so we expect the
    // overlay to get a default z-index of 2.
    assert.equal(fixture.style.zIndex, '2');
  });

  it('leaves the z-index alone if one is specified', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    fixture.style.zIndex = 10;
    fixture.opened = true;
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

  it('appends overlay to body if it not already present, removes it when done', async () => {
    const fixture = document.createElement('overlay-test');
    assert.equal(fixture.parentNode, null);
    await fixture.open();
    assert.equal(fixture.parentNode, document.body);
    await fixture.close();
    assert.equal(fixture.parentNode, null);
  });

  it('leaves overlay where it is, if it is already in the DOM', async () => {
    const div = document.createElement('div');
    const fixture = document.createElement('overlay-test');
    div.appendChild(fixture);
    container.appendChild(div);
    await fixture.open();
    assert.equal(fixture.parentNode, div);
    await fixture.close();
    assert.equal(fixture.parentNode, div);
  });

});
