import {
  defaultState,
  firstRender,
  render,
  rendered,
  setState,
  state,
  stateEffects,
} from "../../src/core/internal.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert, sinon } from "../testHelpers.js";

class ReactiveTest extends ReactiveMixin(HTMLElement) {
  constructor() {
    super();
    this._firstRender = this[firstRender];
  }

  [render](changed) {
    super[render](changed);
    this.renderedResult = this[state].message;
  }

  [rendered](changed) {
    super[rendered](changed);
    this._firstRender = this[firstRender];
  }
}
customElements.define("reactive-test", ReactiveTest);

class ReactiveWithDefaultsTest extends ReactiveTest {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      message: "aardvark",
    });
  }
}
customElements.define("reactive-with-defaults-test", ReactiveWithDefaultsTest);

// Simple class, copies state member `a` to `b`.
class ReactiveStateChangeTest extends ReactiveMixin(HTMLElement) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      a: 0,
    });
  }
  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);
    if (changed.a) {
      effects.b = state.a;
    }
    return effects;
  }
}
customElements.define("reactive-state-change-test", ReactiveStateChangeTest);

// State machine that updates a counter up to 10.
class ReactiveStateLoopTest extends ReactiveMixin(HTMLElement) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      value: 0,
    });
  }
  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);
    if (changed.value && state.value < 10) {
      Object.assign(effects, {
        value: state.value + 1,
      });
    }
    return effects;
  }
}
customElements.define("reactive-state-loop-test", ReactiveStateLoopTest);

describe("ReactiveMixin", function () {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("starts with an empty state object", () => {
    const fixture = new ReactiveTest();
    assert.isEmpty(fixture[state]);
  });

  it("starts with defaultState if defined", () => {
    const fixture = new ReactiveWithDefaultsTest();
    assert.deepEqual(fixture[state], { message: "aardvark" });
  });

  it("setState updates state", () => {
    const fixture = new ReactiveTest();
    fixture[setState]({
      message: "badger",
    });
    assert.deepEqual(fixture[state], { message: "badger" });
  });

  it("state is immutable", () => {
    const fixture = new ReactiveTest();
    // @ts-ignore We know state is read-only, that's why this throws.
    assert.throws(() => (fixture[state] = {}));
    assert.throws(() => (fixture[state].message = "chihuahua"));
  });

  it("setState skips render if component is not in document", async () => {
    const fixture = new ReactiveTest();
    const renderSpy = sinon.spy(fixture, render);
    await fixture[setState]({
      message: "dingo",
    });
    assert.equal(renderSpy.callCount, 0);
  });

  it("setState invokes render if component is in document", async () => {
    const fixture = new ReactiveTest();
    container.append(fixture);
    const renderSpy = sinon.spy(fixture, render);
    await fixture[setState]({
      message: "echidna",
    });
    assert.equal(renderSpy.callCount, 1);
    assert.equal(fixture.renderedResult, "echidna");
  });

  it("consecutive[setState] calls batched into single render call", async () => {
    const fixture = new ReactiveTest();
    container.append(fixture);
    const renderSpy = sinon.spy(fixture, render);
    /* Do *not* await first call - invoke it synchronously. */
    fixture[setState]({
      message: "fox",
    });
    await fixture[setState]({
      message: "gorilla",
    });
    assert.equal(renderSpy.callCount, 1);
    assert.equal(fixture[state].message, "gorilla");
  });

  it("render invokes rendered method if defined", async () => {
    const fixture = new ReactiveTest();
    const renderedSpy = sinon.spy(fixture, rendered);
    container.append(fixture);
    // connectedCallback should trigger first render with promise timing.
    await Promise.resolve();
    assert.equal(renderedSpy.callCount, 1);
    await fixture[setState]({
      message: "iguana",
    });
    assert.equal(renderedSpy.callCount, 2);
  });

  it("[firstRender] is true only in first rendered callback", async () => {
    const fixture = new ReactiveTest();
    assert(typeof fixture[firstRender] === "undefined");
    container.append(fixture);
    // connectedCallback should trigger first render with promise timing.
    await Promise.resolve();
    assert(fixture._firstRender);
    // Remove element, touch it, then put it back.
    container.removeChild(fixture);
    fixture[setState]({ message: "gerbil" });
    container.append(fixture);
    await Promise.resolve();
    assert(!fixture._firstRender);
  });

  it("leaves state object alone if there are no changes", async () => {
    const fixture = new ReactiveTest();
    await fixture[setState]({
      message: "hamster",
    });
    const previousState = fixture[state];
    await fixture[setState]({
      message: "hamster",
    });
    assert.equal(fixture[state], previousState);
  });

  it("runs state change handlers when state changes", () => {
    const fixture = new ReactiveStateChangeTest();
    assert.equal(fixture[state].a, 0);
    assert.equal(fixture[state].b, 0);
    fixture[setState]({ a: 1 });
    assert.equal(fixture[state].b, 1);
    fixture[setState]({ b: 2 }); // Shouldn't have any effect on `a`
    assert.equal(fixture[state].a, 1);
    fixture[setState]({ a: 3 });
    assert.equal(fixture[state].b, 3);
  });

  it("lets a change handler loop as long as necessary", () => {
    const fixture = new ReactiveStateLoopTest();
    assert.equal(fixture[state].value, 10);
  });
});
