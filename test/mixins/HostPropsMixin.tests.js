import * as props from '../../mixins/props.js';
import flushPolyfills from '../flushPolyfills.js';
import HostPropsMixin from '../../mixins/HostPropsMixin.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';
import symbols from '../../mixins/symbols.js';


class HostPropsTest extends HostPropsMixin(ReactiveMixin(HTMLElement)) {

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    return props.merge(base, {
      style: {
        color: this.state.selected ? 'red' : original.style.color
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

  it("updates host with hostProps", async () => {
    const fixture = new HostPropsTest();
    container.appendChild(fixture);
    assert.equal(fixture.style.color, '');
    await fixture.setState({
      selected: true
    });
    assert.equal(fixture.style.color, 'red');
    await fixture.setState({
      selected: false
    });
    // Should be back to original condition.
    assert.equal(fixture.style.color, '');
  });

  it("merges styles on top of original styles", async () => {
    container.innerHTML = `<host-props-test style="background-color: yellow; color: green;"></host-props-test>`;
    flushPolyfills();
    const fixture = container.querySelector('host-props-test');
    await fixture.setState({
      selected: true
    })
    assert.equal(fixture.style.backgroundColor, 'yellow');
    assert.equal(fixture.style.color, 'red');
      
    // Dynamically modify style.
    fixture.style = 'background-color: aqua; color: navy;';
    assert.equal(fixture.style.backgroundColor, 'aqua');
    assert.equal(fixture.style.color, 'red');
  });

});
