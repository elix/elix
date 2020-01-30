import { assert, sinon } from "../test-helpers.js";
import * as internal from "../../src/internal.js";
import ReactiveMixin from "../../src/ReactiveMixin.js";
import State from "../../src/State.js";

class ReactiveTest extends ReactiveMixin(HTMLElement) {
  [internal.componentDidMount]() {
    if (super[internal.componentDidMount]) {
      super[internal.componentDidMount]();
    }
  }

  [internal.componentDidUpdate](/** @typeof {PlainObject} */ changed) {
    if (super[internal.componentDidUpdate]) {
      super[internal.componentDidUpdate](changed);
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], ReactiveTest.defaults);
  }

  [internal.render](changed) {
    if (super[internal.render]) {
      super[internal.render](changed);
    }
    this.renderedResult = this[internal.state].message;
  }
}
ReactiveTest.defaults = undefined;
customElements.define("reactive-test", ReactiveTest);

describe("ReactiveMixin", function() {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("starts with an empty state object", () => {
    const fixture = new ReactiveTest();
    assert.deepEqual(fixture[internal.state], new State({}));
  });

  it("starts with defaultState if defined", () => {
    ReactiveTest.defaults = {
      message: "aardvark"
    };
    const fixture = new ReactiveTest();
    assert.deepEqual(
      fixture[internal.state],
      new State({ message: "aardvark" })
    );
    ReactiveTest.defaults = undefined;
  });

  it("setState updates state", () => {
    const fixture = new ReactiveTest();
    fixture[internal.setState]({
      message: "badger"
    });
    assert.deepEqual(fixture[internal.state], new State({ message: "badger" }));
  });

  it("state is immutable", () => {
    const fixture = new ReactiveTest();
    // @ts-ignore We know state is read-only, that's why this throws.
    assert.throws(() => (fixture[internal.state] = new State()));
    assert.throws(() => (fixture[internal.state].message = "chihuahua"));
  });

  it("setState skips render if component is not in document", async () => {
    const fixture = new ReactiveTest();
    const renderSpy = sinon.spy(fixture, internal.render);
    await fixture[internal.setState]({
      message: "dingo"
    });
    assert.equal(renderSpy.callCount, 0);
  });

  it("setState invokes render if component is in document", async () => {
    const fixture = new ReactiveTest();
    container.appendChild(fixture);
    const renderSpy = sinon.spy(fixture, internal.render);
    await fixture[internal.setState]({
      message: "echidna"
    });
    assert.equal(renderSpy.callCount, 1);
    assert.equal(fixture.renderedResult, "echidna");
  });

  it("consecutive[internal.setState] calls batched into single render call", async () => {
    const fixture = new ReactiveTest();
    container.appendChild(fixture);
    const renderSpy = sinon.spy(fixture, internal.render);
    /* Do *not* await first call - invoke it synchronously. */
    fixture[internal.setState]({
      message: "fox"
    });
    await fixture[internal.setState]({
      message: "gorilla"
    });
    assert.equal(renderSpy.callCount, 1);
    assert.equal(fixture[internal.state].message, "gorilla");
  });

  it("render invokes componentDidMount/componentDidUpdate if defined", async () => {
    const fixture = new ReactiveTest();
    const componentDidMountSpy = sinon.spy(fixture, internal.componentDidMount);
    const componentDidUpdateSpy = sinon.spy(
      fixture,
      internal.componentDidUpdate
    );
    container.appendChild(fixture);
    // connectedCallback should trigger first render with promise timing.
    await Promise.resolve();
    assert.equal(componentDidMountSpy.callCount, 1);
    assert.equal(componentDidUpdateSpy.callCount, 0);
    await fixture[internal.setState]({
      message: "iguana"
    });
    assert.equal(componentDidMountSpy.callCount, 1);
    assert.equal(componentDidUpdateSpy.callCount, 1);
  });

  it("only calls componentDidMount once, even if component is reattached", async () => {
    const fixture = new ReactiveTest();
    const componentDidMountSpy = sinon.spy(fixture, internal.componentDidMount);
    container.appendChild(fixture);
    // connectedCallback should trigger first render with promise timing.
    await Promise.resolve();
    assert.equal(componentDidMountSpy.callCount, 1);
    container.removeChild(fixture);
    container.appendChild(fixture);
    // connectedCallback shouldn't trigger rerender.
    await Promise.resolve();
    assert.equal(componentDidMountSpy.callCount, 1);
  });

  it("leaves state object alone if there are no changes", async () => {
    const fixture = new ReactiveTest();
    await fixture[internal.setState]({
      message: "hamster"
    });
    const previousState = fixture[internal.state];
    await fixture[internal.setState]({
      message: "hamster"
    });
    assert.equal(fixture[internal.state], previousState);
  });

  it("runs state change handlers when state changes", () => {
    // Simple class, copies state member `a` to `b`.
    class Fixture extends ReactiveMixin(HTMLElement) {
      get [internal.defaultState]() {
        const state = super[internal.defaultState];
        state.onChange("a", state => ({ b: state.a }));
        return state;
      }
    }
    const fixture = new Fixture();
    fixture[internal.setState]({ a: 1 });
    assert(fixture[internal.state].b === 1);
    fixture[internal.setState]({ b: 2 }); // Shouldn't have any effect on `a`
    assert(fixture[internal.state].a === 1);
    fixture[internal.setState]({ a: 3 });
    assert(fixture[internal.state].b === 3);
  });

  it("runs state change handlers on initial state", () => {
    class Fixture extends ReactiveMixin(HTMLElement) {
      get [internal.defaultState]() {
        const state = super[internal.defaultState];
        state.a = 1;
        state.onChange("a", state => ({ b: state.a }));
        return state;
      }
    }
    const fixture = new Fixture();
    assert(fixture[internal.state].a === 1);
    assert(fixture[internal.state].b === 1);
    fixture[internal.setState]({ a: 2 });
    assert(fixture[internal.state].b === 2);
  });
});
