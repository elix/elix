import ReactiveMixin from '../../mixins/ReactiveMixin.js';
import symbols from '../../mixins/symbols.js';


class ReactiveTest extends ReactiveMixin(HTMLElement) {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
  }

  componentDidUpdate() {
    if (super.componentDidUpdate) { super.componentDidUpdate(); }
  }

  get defaultState() {
    return this.constructor.defaults || {};
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
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
    const fixture = document.createElement('reactive-test');
    assert.deepEqual(fixture.state, {});
  });

  it("starts with defaultState if defined", () => {
    ReactiveTest.defaults = {
      message: 'aardvark'
    };
    const fixture = document.createElement('reactive-test');
    assert.deepEqual(fixture.state, { message: 'aardvark' });
    ReactiveTest.defaults = undefined;
  });

  it("setState updates state", () => {
    const fixture = document.createElement('reactive-test');
    fixture.setState({
      message: 'badger'
    });
    assert.deepEqual(fixture.state, { message: 'badger' });
  });

  it("state is immutable", () => {
    const fixture = document.createElement('reactive-test');
    assert.throws(() => fixture.state = {});
    assert.throws(() => fixture.state.message = 'chihuahua');
  });

  it("setState skips render if component is not in document", done => {
    const fixture = document.createElement('reactive-test');
    const renderSpy = sinon.spy(fixture, symbols.render);
    fixture.setState({
      message: 'dingo'
    }).then(() => {
      assert.equal(renderSpy.callCount, 0);
      done();
    });
  });

  it("setState invokes render if component is in document", done => {
    const fixture = document.createElement('reactive-test');
    container.appendChild(fixture);
    const renderSpy = sinon.spy(fixture, symbols.render);
    fixture.setState({
      message: 'echidna'
    }).then(() => {
      assert.equal(renderSpy.callCount, 1);
      assert.equal(fixture.renderedResult, 'echidna');
      done();
    });
  });

  it("consecutive setState calls batched into single render call", done => {
    const fixture = document.createElement('reactive-test');
    container.appendChild(fixture);
    const renderSpy = sinon.spy(fixture, symbols.render);
    fixture.setState({
      message: 'fox'
    });
    fixture.setState({
      message: 'gorilla'
    }).then(() => {
      assert.equal(renderSpy.callCount, 1);
      assert.equal(fixture.state.message, 'gorilla');
      done();
    });
  });

  it("render invokes componentDidMount/componentDidUpdate if defined", done => {
    const fixture = document.createElement('reactive-test');
    const componentDidMountSpy = sinon.spy(fixture, 'componentDidMount');
    const componentDidUpdateSpy = sinon.spy(fixture, 'componentDidUpdate');
    container.appendChild(fixture);
    // connectedCallback should trigger first render with promise timing.
    Promise.resolve(() => {
      assert.equal(componentDidMountSpy.callCount, 1);
      assert.equal(componentDidUpdateSpy.callCount, 0);
      return fixture.setState({
        message: 'iguana'
      })
    })
    .then(() => {
      assert.equal(componentDidMountSpy.callCount, 1);
      assert.equal(componentDidUpdateSpy.callCount, 0);
      done();
    });
  })

  it("leaves state object alone if there are no changes", done => {
    const fixture = document.createElement('reactive-test');
    let previousState;
    fixture.setState({
      message: 'hamster'
    })
    .then(() => {
      previousState = fixture.state;
      return fixture.setState({
        message: 'hamster'
      });
    })
    .then(() => {
      assert.equal(fixture.state, previousState);
      done();
    });
  });

});
