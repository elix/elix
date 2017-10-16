import { assert } from 'chai';
import * as props from '../../mixins/props.js';
import HostPropsMixin from '../../mixins/HostPropsMixin.js';
import symbols from '../../mixins/symbols.js';


class HostPropsTest extends HostPropsMixin(HTMLElement) {

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    return props.mergeProps(base, {
      style: {
        color: 'red'
      }
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

  it("updates host with hostProps", done => {
    const fixture = new HostPropsTest();
    fixture[symbols.render]()
    .then(() => {
      assert.equal(fixture.style.color, 'red');
      done();
    });
  });

});
