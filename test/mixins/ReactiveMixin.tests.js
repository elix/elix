import { assert } from 'chai';
import sinon from 'sinon';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';
import symbols from '../../mixins/symbols.js';


class ReactiveTest extends ReactiveMixin(HTMLElement) {

  get defaultState() {
    return this.constructor.defaults || {};
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

  it("render invokes componentDidUpdate if defined", done => {
    const fixture = document.createElement('reactive-test');
    const componentDidUpdateSpy = sinon.spy(fixture, 'componentDidUpdate');
    fixture.render()
    .then(() => {
      assert.equal(componentDidUpdateSpy.callCount, 1);
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
