import { assert } from 'chai';
import sinon from 'sinon';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';


class ReactiveTest extends ReactiveMixin(HTMLElement) {}
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

  it("setState updates state", () => {
    const fixture = document.createElement('reactive-test');
    fixture.setState({
      message: 'aardvark'
    });
    assert.deepEqual(fixture.state, { message: 'aardvark' });
  });

  it("state is immutable", () => {
    const fixture = document.createElement('reactive-test');
    assert.throws(() => fixture.state = {});
    assert.throws(() => fixture.state.message = 'badger');
  });

  it("setState skips render if component is not in document", done => {
    const fixture = document.createElement('reactive-test');
    const renderSpy = sinon.spy(fixture, 'render');
    fixture.setState({
      message: 'chihuahua'
    });
    Promise.resolve().then(() => {
      assert.equal(renderSpy.callCount, 0);
      done();
    });
  });

  it("setState invokes render if component is in document", done => {
    const fixture = document.createElement('reactive-test');
    container.appendChild(fixture);
    const renderSpy = sinon.spy(fixture, 'render');
    fixture.setState({
      message: 'dingo'
    });
    Promise.resolve().then(() => {
      assert.equal(renderSpy.callCount, 1);
      done();
    });
  });

});
