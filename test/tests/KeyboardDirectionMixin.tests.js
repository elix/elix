import * as symbols from '../../src/symbols.js';
import KeyboardDirectionMixin from '../../src/KeyboardDirectionMixin.js';


class KeyboardDirectionMixinTest extends KeyboardDirectionMixin(HTMLElement) {

  constructor() {
    super();
    this[symbols.state] = {};
  }

  [symbols.goRight]() {
    if (super[symbols.goRight]) { super[symbols.goRight](); }
    return true;
  }

}
customElements.define('keyboard-direction-test', KeyboardDirectionMixinTest);


describe("KeyboardDirectionMixin", () => {

  it("maps a Right arrow key to a goRight action", () => {
    const fixture = new KeyboardDirectionMixinTest();
    const spy = sinon.spy(fixture, symbols.goRight);
    const result = fixture[symbols.keydown]({
      key: 'ArrowRight'
    });
    assert(spy.calledOnce);
    assert(result);
  });

  it("ignores a Right arrow key when orientation is vertical", () => {
    const fixture = new KeyboardDirectionMixinTest();
    Object.assign(fixture[symbols.state], {
      orientation: 'vertical'
    });
    const spy = sinon.spy(fixture, symbols.goRight);
    const result = fixture[symbols.keydown]({
      key: 'ArrowRight'
    });
    assert(!spy.calledOnce);
    assert(!result);
  });

  it("ignores a Right arrow key if the meta (command) key was pressed", () => {
    const fixture = new KeyboardDirectionMixinTest();
    const spy = sinon.spy(fixture, symbols.goRight);
    const result = fixture[symbols.keydown]({
      altKey: true,
      key: 'ArrowRight'
    });
    assert(!spy.calledOnce);
    assert(!result);
  });

});
