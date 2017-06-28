import { assert } from 'chai';
import OverlayMixin from '../../mixins/OverlayMixin.js';
import symbols from '../../mixins/symbols.js';
import sinon from 'sinon';


class OverlayTest extends OverlayMixin(HTMLElement) {

  constructor() {
    super();
    this._opened = false;
  }

  // Simplistic implementation of opened.
  get opened() {
    return this._opened;
  }
  set opened(opened) {
    this._opened = opened;
    const effect = opened ? 'opening' : 'closing';
    this[symbols.beforeEffect](effect);
    this[symbols.afterEffect](effect);
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

  it('sets a default z-index', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    fixture.opened = true;
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

  it('gives overlay focus when opened, restores focus to previous element when closed', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    const input = document.createElement('input');
    container.appendChild(input);
    input.focus();
    fixture.opened = true;
    assert.equal(document.activeElement, fixture);
    fixture.opened = false;
    assert.equal(document.activeElement, input);    
  });

  it('appends overlay to body if it not already present, removes it when done', () => {
    const fixture = document.createElement('overlay-test');
    assert.equal(fixture.parentNode, null);
    fixture.opened = true;
    assert.equal(fixture.parentNode, document.body);
    fixture.opened = false;
    assert.equal(fixture.parentNode, null);
  });

  it('leaves overlay where it is, if it is already in the DOM', () => {
    const div = document.createElement('div');
    const fixture = document.createElement('overlay-test');
    div.appendChild(fixture);
    container.appendChild(div);
    fixture.opened = true;
    assert.equal(fixture.parentNode, div);
    fixture.opened = false;
    assert.equal(fixture.parentNode, div);
  });

  it('teleports overlay to body if asked to do so', () => {
    const div = document.createElement('div');
    const fixture = document.createElement('overlay-test');
    assert(!fixture.teleportToBodyOnOpen);
    fixture.teleportToBodyOnOpen = true;
    div.appendChild(fixture);
    container.appendChild(div);
    fixture.opened = true;
    assert.equal(fixture.parentNode, document.body);
    fixture.opened = false;
    assert.equal(fixture.parentNode, div);
  });

  it('invokes beforeEffect and afterEffect synchronously', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    const beforeEffectSpy = sinon.spy(fixture, symbols.beforeEffect);
    const afterEffectSpy = sinon.spy(fixture, symbols.afterEffect);
    fixture.opened = true;
    assert(beforeEffectSpy.calledOnce);
    assert(beforeEffectSpy.calledWith('opening'));
    assert(beforeEffectSpy.calledImmediatelyBefore(afterEffectSpy));
    assert(afterEffectSpy.calledWith('opening'));
  });

  it('doesn\'t invoke beforeEffect and afterEffect if showEffect is defined', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    const beforeEffectSpy = sinon.spy(fixture, symbols.beforeEffect);
    const afterEffectSpy = sinon.spy(fixture, symbols.afterEffect);
    fixture[symbols.showEffect] = () => {
      assert(!beforeEffectSpy.called);
      assert(!afterEffectSpy.called);
    };
    fixture.opened = true;
  });

});
