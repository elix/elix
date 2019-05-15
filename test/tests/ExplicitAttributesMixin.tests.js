import * as symbols from '../../src/symbols.js';
import ExplicitAttributesMixin from '../../src/ExplicitAttributesMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';


class ExplicitAttributesTest extends ExplicitAttributesMixin(ReactiveMixin(HTMLElement)) {

  [symbols.render](changed) {
    if (super[symbols.render]) { super[symbols.render](changed); }
    if (changed.explicitClasses || changed.explicitStyle || changed.selected) {
      const { explicitClasses, explicitStyle } = this.state;
      const selected = this.state.selected || 
        (explicitClasses && explicitClasses.selected)
        || false;
      this.classList.toggle('selected', selected);
      const color = selected ?
        'red' :
        (explicitStyle && explicitStyle.color) || null;
      this.style.color = color;
    }
  }

}
customElements.define('explicit-attributes-test', ExplicitAttributesTest);


describe("ExplicitAttributesMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("doesn't set any state for an element with no attributes, classes, or styles", () => {
    const fixture = new ExplicitAttributesTest();
    container.appendChild(fixture);
    assert(fixture.state.original === undefined);
  });

  it("initializes state to track original attributes, classes, and styles", () => {
    container.innerHTML = `<explicit-attributes-test class="foo bar" style="color: red;" aria-selected="false"></explicit-attributes-test>`;
    const fixture = container.querySelector('explicit-attributes-test');
    container.appendChild(fixture);
    assert.deepEqual(fixture.state.explicitAttributes, {
      'aria-selected': 'false'
    });
    assert.deepEqual(fixture.state.explicitClasses, {
      bar: true,
      foo: true
    });
    assert.deepEqual(fixture.state.explicitStyle, {
      color: 'red'
    });
  });

  it("updates host with props", async () => {
    const fixture = new ExplicitAttributesTest();
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
    const fixture = new ExplicitAttributesTest();
    fixture.setAttribute('foo', 'bar');
    assert.equal(fixture.state.explicitAttributes.foo, 'bar');
    fixture.removeAttribute('foo');
    assert.equal(fixture.state.explicitAttributes.foo, undefined);
  });

  it("records state when toggling Boolean attributes", () => {
    const fixture = new ExplicitAttributesTest();
    fixture.toggleAttribute('disabled');
    assert.equal(fixture.state.explicitAttributes.disabled, '');
    fixture.toggleAttribute('disabled');
    assert.equal(fixture.state.explicitAttributes.disabled, undefined);
    fixture.toggleAttribute('disabled', true);
    fixture.toggleAttribute('disabled', true);
    assert.equal(fixture.state.explicitAttributes.disabled, '');
    fixture.toggleAttribute('disabled', false);
    fixture.toggleAttribute('disabled', false);
    assert.equal(fixture.state.explicitAttributes.disabled, undefined);
  });

  it("merges styles on top of original styles", async () => {
    container.innerHTML = `<explicit-attributes-test style="background-color: yellow; color: green;"></explicit-attributes-test>`;
    const fixture = container.querySelector('explicit-attributes-test');
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
    container.innerHTML = `<explicit-attributes-test class='foo'></explicit-attributes-test>`;
    const fixture = container.querySelector('explicit-attributes-test');
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
    container.innerHTML = `<explicit-attributes-test class='selected'></explicit-attributes-test>`;
    const fixture = container.querySelector('explicit-attributes-test');
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
