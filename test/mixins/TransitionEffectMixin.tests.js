import { assert } from 'chai';
import sinon from 'sinon';
import symbols from '../../mixins/symbols.js';
import TransitionEffectMixin from '../../mixins/TransitionEffectMixin.js';


class AsyncEffectTest extends TransitionEffectMixin(HTMLElement) {
  [symbols.beforeEffect]() {}
  [symbols.applyEffect]() {
    return Promise.resolve();
  }
  [symbols.afterEffect]() {}
}
customElements.define('async-effect-test', AsyncEffectTest);


class TransitionEffectTest extends TransitionEffectMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          opacity: 0;
        }

        :host(.effect) {
          transition: opacity 0.01s;
        }

        :host(.opening) {
          opacity: 1;
        }
      </style>
    `;
  }
}
customElements.define('transition-effect-test', TransitionEffectTest);


describe("TransitionEffectMixin", function() {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it('invokes effect methods in a standard order', done => {
    const fixture = document.createElement('async-effect-test');
    const beforeEffectSpy = sinon.spy(fixture, symbols.beforeEffect);
    const applyEffectSpy = sinon.spy(fixture, symbols.applyEffect);
    const afterEffectSpy = sinon.spy(fixture, symbols.afterEffect);
    container.appendChild(fixture);
    fixture[symbols.showEffect]('test')
    .then(() => {
      assert(beforeEffectSpy.calledOnce);
      assert(beforeEffectSpy.calledImmediatelyBefore(applyEffectSpy));
      assert(applyEffectSpy.calledOnce);
      assert(applyEffectSpy.calledImmediatelyBefore(afterEffectSpy));
      assert(afterEffectSpy.calledOnce);
      done();
    });
  });

  it('applies CSS classes that trigger an asynchronous CSS transition', done => {
    const fixture = document.createElement('transition-effect-test');
    container.appendChild(fixture);
    assert.equal(getComputedStyle(fixture).opacity, '0');
    fixture[symbols.applyEffect]('opening')
    .then(() => {
      assert.equal(getComputedStyle(fixture).opacity, '1');
      done();
    });
  });

});
