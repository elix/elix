import { assert } from 'chai';
import * as props from '../../mixins/props.js';
import HostPropsMixin from '../../mixins/HostPropsMixin.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';
import symbols from '../../mixins/symbols.js';


class HostPropsTest extends HostPropsMixin(ReactiveMixin(HTMLElement)) {

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    const selected = this.state.selected;
    const color = selected && 'red';
    const style = color ? { color } : {};
    return props.mergeProps(base, {
      style
    });
  }

}
customElements.define('host-props-test', HostPropsTest);


describe("HostPropsMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it.skip("updates host with hostProps", done => {
    const fixture = new HostPropsTest();
    container.appendChild(fixture);
    assert.equal(fixture.style.color, '');
    fixture.setState({
      selected: true
    })
    .then(() => {
      assert.equal(fixture.style.color, 'red');
      return fixture.setState({
        selected: false
      });
    })
    .then(() => {
      // Should be back to original condition.
      assert.equal(fixture.style.color, '');      
      done();
    })
  });

  it("merges styles on top of original styles", done => {
    container.innerHTML = `<host-props-test style="background-color: yellow; color: green;"></host-props-test>`;
    const fixture = container.querySelector('host-props-test');
    fixture.setState({
      selected: true
    })
    .then(() => {
      assert.equal(fixture.style.backgroundColor, 'yellow');
      assert.equal(fixture.style.color, 'red');
      
      // Dynamically modify style.
      fixture.style = 'background-color: aqua; color: navy;';
      assert.equal(fixture.style.backgroundColor, 'aqua');
      assert.equal(fixture.style.color, 'red');
      done();
    });
  });

});
