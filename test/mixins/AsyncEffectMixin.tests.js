import { assert } from 'chai';
import AsyncEffectMixin from '../../mixins/AsyncEffectMixin.js';
import symbols from '../../mixins/symbols.js';
import sinon from 'sinon';


class AsyncEffectTest extends AsyncEffectMixin(HTMLElement) {
  [symbols.beforeEffect]() {}
  [symbols.applyEffect]() {
    return Promise.resolve();
  }
  [symbols.afterEffect]() {}
}
customElements.define('async-effect-test', AsyncEffectTest);


describe("AsyncEffectMixin", function() {

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

});
