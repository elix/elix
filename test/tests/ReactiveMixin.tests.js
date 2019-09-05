import * as symbols from '../../src/symbols.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';


class ReactiveTest extends ReactiveMixin(HTMLElement) {

  [symbols.componentDidMount]() {
    if (super[symbols.componentDidMount]) { super[symbols.componentDidMount](); }
  }

  componentDidUpdate(changed) {
    if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
  }

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], this.constructor.defaults);
  }

  [symbols.render](changed) {
    if (super[symbols.render]) { super[symbols.render](changed); }
    this.renderedResult = this.state.message;
  }

}
customElements.define('reactive-test', ReactiveTest);


describe("ReactiveMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("starts with an empty state object", () => {
    const fixture = new ReactiveTest();
    assert.deepEqual(fixture.state, {});
  });

  it("starts with defaultState if defined", () => {
    ReactiveTest.defaults = {
      message: 'aardvark'
    };
    const fixture = new ReactiveTest();
    assert.deepEqual(fixture.state, { message: 'aardvark' });
    ReactiveTest.defaults = undefined;
  });

  it("setState updates state", () => {
    const fixture = new ReactiveTest();
    fixture[symbols.setState]({
      message: 'badger'
    });
    assert.deepEqual(fixture.state, { message: 'badger' });
  });

  it("state is immutable", () => {
    const fixture = new ReactiveTest();
    assert.throws(() => fixture.state = {});
    assert.throws(() => fixture.state.message = 'chihuahua');
  });

  it("setState skips render if component is not in document", async () => {
    const fixture = new ReactiveTest();
    const renderSpy = sinon.spy(fixture, symbols.render);
    await fixture[symbols.setState]({
      message: 'dingo'
    });
    assert.equal(renderSpy.callCount, 0);
  });

  it("setState invokes render if component is in document", async () => {
    const fixture = new ReactiveTest();
    container.appendChild(fixture);
    const renderSpy = sinon.spy(fixture, symbols.render);
    await fixture[symbols.setState]({
      message: 'echidna'
    });
    assert.equal(renderSpy.callCount, 1);
    assert.equal(fixture.renderedResult, 'echidna');
  });

  it("consecutive[symbols.setState] calls batched into single render call", async () => {
    const fixture = new ReactiveTest();
    container.appendChild(fixture);
    const renderSpy = sinon.spy(fixture, symbols.render);
    /* Do *not* await first call - invoke it synchronously. */
    fixture[symbols.setState]({
      message: 'fox'
    });
    await fixture[symbols.setState]({
      message: 'gorilla'
    });
    assert.equal(renderSpy.callCount, 1);
    assert.equal(fixture.state.message, 'gorilla');
  });

  it("render invokes componentDidMount/componentDidUpdate if defined", async () => {
    const fixture = new ReactiveTest();
    const componentDidMountSpy = sinon.spy(fixture, symbols.componentDidMount);
    const componentDidUpdateSpy = sinon.spy(fixture, 'componentDidUpdate');
    container.appendChild(fixture);
    // connectedCallback should trigger first render with promise timing.
    await Promise.resolve();
    assert.equal(componentDidMountSpy.callCount, 1);
    assert.equal(componentDidUpdateSpy.callCount, 0);
    await fixture[symbols.setState]({
      message: 'iguana'
    });
    assert.equal(componentDidMountSpy.callCount, 1);
    assert.equal(componentDidUpdateSpy.callCount, 1);
  })

  it("only calls componentDidMount once, even if component is reattached", async () => {
    const fixture = new ReactiveTest();
    const componentDidMountSpy = sinon.spy(fixture, symbols.componentDidMount);
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
    await fixture[symbols.setState]({
      message: 'hamster'
    });
    const previousState = fixture.state;
    await fixture[symbols.setState]({
      message: 'hamster'
    });
    assert.equal(fixture.state, previousState);
  });

  it("runs state change handlers when state changes", () => {
    // Simple class, copies state member `a` to `b`.
    class Fixture extends ReactiveMixin(Object) {
      get [symbols.defaultState]() {
        const state = super[symbols.defaultState];
        state.onChange('a', state => ({ b: state.a }));
        return state;
      }
    }
    const fixture = new Fixture();
    fixture[symbols.setState]({ a: 1 });
    assert(fixture.state.b === 1);
    fixture[symbols.setState]({ b: 2 }); // Shouldn't have any effect on `a`
    assert(fixture.state.a === 1);
    fixture[symbols.setState]({ a: 3 });
    assert(fixture.state.b === 3);
  });
  
  it("runs state change handlers on initial state", () => {
    class Fixture extends ReactiveMixin(Object) {
      get [symbols.defaultState]() {
        const state = super[symbols.defaultState];
        state.a = 1;
        state.onChange('a', state => ({ b: state.a }));
        return state;
      }
    }
    const fixture = new Fixture();
    assert(fixture.state.a === 1);
    assert(fixture.state.b === 1);
    fixture[symbols.setState]({ a: 2 });
    assert(fixture.state.b === 2);
  })
  
});
