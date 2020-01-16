import { assert } from '../chai.js';
import sinon from "sinon";
import * as internal from "../../src/internal.js";
import KeyboardDirectionMixin from "../../src/KeyboardDirectionMixin.js";

class KeyboardDirectionMixinTest extends KeyboardDirectionMixin(HTMLElement) {
  constructor() {
    super();
    this[internal.state] = { orientation: "" };
  }

  [internal.goRight]() {
    if (super[internal.goRight]) {
      super[internal.goRight]();
    }
    return true;
  }
}
customElements.define("keyboard-direction-test", KeyboardDirectionMixinTest);

describe("KeyboardDirectionMixin", () => {
  it("maps a Right arrow key to a goRight action", () => {
    const fixture = new KeyboardDirectionMixinTest();
    const spy = sinon.spy(fixture, internal.goRight);
    const result = fixture[internal.keydown]({
      key: "ArrowRight"
    });
    assert(spy.calledOnce);
    assert(result);
  });

  it("ignores a Right arrow key when orientation is vertical", () => {
    const fixture = new KeyboardDirectionMixinTest();
    Object.assign(fixture[internal.state], {
      orientation: "vertical"
    });
    const spy = sinon.spy(fixture, internal.goRight);
    const result = fixture[internal.keydown]({
      key: "ArrowRight"
    });
    assert(!spy.calledOnce);
    assert(!result);
  });

  it("ignores a Right arrow key if the meta (command) key was pressed", () => {
    const fixture = new KeyboardDirectionMixinTest();
    const spy = sinon.spy(fixture, internal.goRight);
    const result = fixture[internal.keydown]({
      altKey: true,
      key: "ArrowRight"
    });
    assert(!spy.calledOnce);
    assert(!result);
  });
});
