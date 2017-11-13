import { merge } from '../../utilities/updates.js';
import flushPolyfills from '../flushPolyfills.js';
import RenderUpdatesMixin from '../../mixins/RenderUpdatesMixin.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js';


class PropsTest extends RenderUpdatesMixin(ReactiveMixin(HTMLElement)) {

  get updates() {
    return merge(super.updates, {
      classes: {
        selected: this.state.selected || this.state.original.classes.selected
      },
      style: {
        color: this.state.selected ? 'red' : this.state.original.style.color
      }
    });
  }

}
customElements.define('props-test', PropsTest);


describe("RenderUpdatesMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("updates host with props", async () => {
    const fixture = new PropsTest();
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
    container.innerHTML = `<props-test style="background-color: yellow; color: green;"></props-test>`;
    flushPolyfills();
    const fixture = container.querySelector('props-test');
    await fixture.setState({
      selected: true
    })
    assert.equal(fixture.style.backgroundColor, 'yellow');
    assert.equal(fixture.style.color, 'red');
      
    // Dynamically modify style.
    fixture.setAttribute('style', 'background-color: aqua; color: navy;');
    await Promise.resolve();
    assert.equal(fixture.style.backgroundColor, 'aqua');
    assert.equal(fixture.style.color, 'red');

    await fixture.setState({
      selected: false
    });
    assert.equal(fixture.style.backgroundColor, 'aqua');
    assert.equal(fixture.style.color, 'navy');    
  });

  it("merges classes on top of original classes", async () => {
    container.innerHTML = `<props-test class='foo'></props-test>`;
    flushPolyfills();
    const fixture = container.querySelector('props-test');
    assert(fixture.classList.contains('foo'));
    assert(!fixture.classList.contains('selected'));

    await fixture.setState({
      selected: true
    });
    assert(fixture.classList.contains('foo'));
    assert(fixture.classList.contains('selected'));

    await fixture.setState({
      selected: false
    });
    assert(fixture.classList.contains('foo'));
    assert(!fixture.classList.contains('selected'));
  });

  it("respects original classes", async () => {
    container.innerHTML = `<props-test class='selected'></props-test>`;
    flushPolyfills();
    const fixture = container.querySelector('props-test');
    assert(fixture.classList.contains('selected'));

    await fixture.setState({
      selected: true
    });
    assert(fixture.classList.contains('selected'));

    await fixture.setState({
      selected: false
    });
    assert(fixture.classList.contains('selected'));
  });

});
