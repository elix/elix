import { goRight, keydown, state } from "../../src/base/internal.js";
import KeyboardDirectionMixin from "../../src/base/KeyboardDirectionMixin.js";
import { assert, sinon } from "../testHelpers.js";

class KeyboardDirectionMixinTest extends KeyboardDirectionMixin(HTMLElement) {
  constructor() {
    super();
    this[state] = { orientation: "" };
  }

  [goRight]() {
    if (super[goRight]) {
      super[goRight]();
    }
    return true;
  }
}
customElements.define("keyboard-direction-test", KeyboardDirectionMixinTest);

describe("KeyboardDirectionMixin", () => {
  it("maps a Right arrow key to a goRight action", () => {
    const fixture = new KeyboardDirectionMixinTest();
    const spy = sinon.spy(fixture, goRight);
    const result = fixture[keydown]({
      key: "ArrowRight",
      target: fixture,
    });
    assert(spy.calledOnce);
    assert(result);
  });

  it("ignores a Right arrow key when orientation is vertical", () => {
    const fixture = new KeyboardDirectionMixinTest();
    Object.assign(fixture[state], {
      orientation: "vertical",
    });
    const spy = sinon.spy(fixture, goRight);
    const result = fixture[keydown]({
      key: "ArrowRight",
    });
    assert(!spy.calledOnce);
    assert(!result);
  });

  it("ignores a Right arrow key if the meta (command) key was pressed", () => {
    const fixture = new KeyboardDirectionMixinTest();
    const spy = sinon.spy(fixture, goRight);
    const result = fixture[keydown]({
      altKey: true,
      key: "ArrowRight",
    });
    assert(!spy.calledOnce);
    assert(!result);
  });
});
