import { assert } from 'chai';
import KeyboardDirectionMixin from '../src/KeyboardDirectionMixin';
import sinon from 'sinon';
import symbols from '../src/symbols';


class KeyboardDirectionMixinTest extends KeyboardDirectionMixin(HTMLElement) {
  [symbols.goRight]() {
    if (super[symbols.goRight]) { super[symbols.goRight](); }
    return true;
  }
}
customElements.define('keyboard-direction-test', KeyboardDirectionMixinTest);


describe("KeyboardDirectionMixin", () => {

  it("maps a Right arrow key to a goRight action", () => {
    const fixture = document.createElement('keyboard-direction-test');
    const spy = sinon.spy(fixture, symbols.goRight);
    const result = fixture[symbols.keydown]({
      keyCode: 39
    });
    assert(spy.calledOnce);
    assert(result);
  });

  it("ignores a Right arrow key when orientation is vertical", () => {
    const fixture = document.createElement('keyboard-direction-test');
    fixture[symbols.orientation] = 'vertical';
    const spy = sinon.spy(fixture, symbols.goRight);
    const result = fixture[symbols.keydown]({
      keyCode: 39
    });
    assert(!spy.calledOnce);
    assert(!result);
  });

  it("ignores a Right arrow key if the meta (command) key was pressed", () => {
    const fixture = document.createElement('keyboard-direction-test');
    const spy = sinon.spy(fixture, symbols.goRight);
    const result = fixture[symbols.keydown]({
      altKey: true,
      keyCode: 39
    });
    assert(!spy.calledOnce);
    assert(!result);
  });

});
