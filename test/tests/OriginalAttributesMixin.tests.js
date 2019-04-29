import { merge } from '../../src/updates.js';
import flushPolyfills from '../flushPolyfills.js';
import OriginalAttributesMixin from '../../src/OriginalAttributesMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';


class OriginalAttributesTest extends OriginalAttributesMixin(ReactiveMixin(HTMLElement)) {

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
customElements.define('original-attributes-test', OriginalAttributesTest);


describe("OriginalAttributesMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("updates host with props", async () => {
    const fixture = new OriginalAttributesTest();
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

  it("tracks original attribute values", () => {
    const fixture = new OriginalAttributesTest();
    fixture.setAttribute('foo', 'bar');
    assert.equal(fixture.state.original.attributes.foo, 'bar');
    fixture.removeAttribute('foo');
    assert.isNull(fixture.state.original.attributes.foo);
  });

  it("merges styles on top of original styles", async () => {
    container.innerHTML = `<original-attributes-test style="background-color: yellow; color: green;"></original-attributes-test>`;
    flushPolyfills();
    const fixture = container.querySelector('original-attributes-test');
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
    container.innerHTML = `<original-attributes-test class='foo'></original-attributes-test>`;
    flushPolyfills();
    const fixture = container.querySelector('original-attributes-test');
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
    container.innerHTML = `<original-attributes-test class='selected'></original-attributes-test>`;
    flushPolyfills();
    const fixture = container.querySelector('original-attributes-test');
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
