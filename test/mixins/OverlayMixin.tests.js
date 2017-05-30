import { assert } from 'chai';
import OverlayMixin from '../../mixins/OverlayMixin.js';
import symbols from '../../mixins/symbols.js';
import sinon from 'sinon';


class OverlayTest extends OverlayMixin(HTMLElement) {}
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
    fixture[symbols.openedChanged](true);
    // Mocha test runner has element with z-index of 1, so we expect the
    // overlay to get a default z-index of 2.
    assert.equal(fixture.style.zIndex, '2');
  });

  it('leaves the z-index alone if one is specified', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    fixture.style.zIndex = 10;
    fixture[symbols.openedChanged](true);
    assert.equal(fixture.style.zIndex, '10');
  });

  it('gives overlay focus when opened, restores focus to previous element when closed', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    const input = document.createElement('input');
    container.appendChild(input);
    input.focus();
    fixture[symbols.openedChanged](true);
    assert.equal(document.activeElement, fixture);
    fixture[symbols.openedChanged](false);
    assert.equal(document.activeElement, input);    
  });

  it('adds overlay to document if it not already present, removes it when done', () => {
    const fixture = document.createElement('overlay-test');
    assert.equal(fixture.parentNode, null);
    fixture[symbols.openedChanged](true);
    assert.equal(fixture.parentNode, document.body);
    fixture[symbols.openedChanged](false);
    assert.equal(fixture.parentNode, null);
  });

  it('invokes beforeEffect and afterEffect synchronously', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    const beforeEffectSpy = sinon.spy(fixture, symbols.beforeEffect);
    const afterEffectSpy = sinon.spy(fixture, symbols.afterEffect);
    fixture[symbols.openedChanged](true);
    assert(beforeEffectSpy.calledWith('opening'));
    assert(afterEffectSpy.calledWith('opening'));
  });

  it('invokes beforeEffect and afterEffect asynchronously if showEffect is defined', () => {
    const fixture = document.createElement('overlay-test');
    container.appendChild(fixture);
    const beforeEffectSpy = sinon.spy(fixture, symbols.beforeEffect);
    const afterEffectSpy = sinon.spy(fixture, symbols.afterEffect);
    fixture[symbols.showEffect] = () => {
      assert(!beforeEffectSpy.called);
      assert(!afterEffectSpy.called);
    };
    fixture[symbols.openedChanged](true);
  });

});
