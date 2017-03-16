import { assert } from 'chai';
import AttributeMarshallingMixin from '../../mixins//AttributeMarshallingMixin';
import flushPolyfills from '../../test/flushPolyfills';


let defaultPropertyValue;
let defaultClass;


/* Element with camelCase property name */
class ElementWithCustomProperty extends AttributeMarshallingMixin(HTMLElement) {

  constructor() {
    super();
    if (typeof defaultPropertyValue !== 'undefined') {
      this.customProperty = defaultPropertyValue;
    }
  }

  get customProperty() {
    return this._customProperty;
  }
  set customProperty(value) {
    this._customProperty = value;
    this.reflectAttribute('custom-property', value);
  }

}
customElements.define('element-with-custom-property', ElementWithCustomProperty);


/* Element that adds a class to itself */
class ElementWithClass extends AttributeMarshallingMixin(HTMLElement) {
  constructor() {
    super();
    if (typeof defaultClass !== 'undefined') {
      this.reflectClass(defaultClass, true);
    }
  }
}
customElements.define('element-with-class', ElementWithClass);


describe("AttributeMarshallingMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
    defaultPropertyValue = undefined;
    defaultClass = undefined;
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("defines observedAttributes for all custom property setters", () => {
    const observedAttributes = ElementWithCustomProperty.observedAttributes;
    assert.deepEqual(observedAttributes, ['custom-property']);
  });

  it("marshals hyphenated attribute to corresponding camelCase property", () => {
    const fixture = document.createElement('element-with-custom-property');
    assert.isUndefined(fixture.customProperty);
    fixture.setAttribute('custom-property', "Hello");
    assert.equal(fixture.customProperty, "Hello");
  });

  it("reflects property to attribute immediately if connected to document", () => {
    const fixture = document.createElement('element-with-custom-property');
    assert.isNull(fixture.getAttribute('custom-property'));
    container.appendChild(fixture);
    fixture.customProperty = 'foo';
    flushPolyfills();
    assert.equal(fixture.getAttribute('custom-property'), 'foo');
  });

  it("defers reflection of attribute during constructor until connected to document", () => {
    defaultPropertyValue = 'foo';
    const fixture = document.createElement('element-with-custom-property');
    assert.isNull(fixture.getAttribute('custom-property'));
    container.appendChild(fixture);
    flushPolyfills();
    assert.equal(fixture.getAttribute('custom-property'), 'foo');
  });

  it("reflects class immediately if connected to document", () => {
    const fixture = document.createElement('element-with-class');
    assert.equal(fixture.classList.length, 0);
    container.appendChild(fixture);
    fixture.reflectClass('custom', true);
    flushPolyfills();
    assert.equal(fixture.classList.length, 1);
    assert.equal(fixture.classList[0], ['custom']);
  });

  it("defers reflection of class during constructor until connected to document", () => {
    defaultClass = 'custom';
    const fixture = document.createElement('element-with-class');
    assert.equal(fixture.classList.length, 0);
    container.appendChild(fixture);
    flushPolyfills();
    assert.equal(fixture.classList.length, 1);
    assert.equal(fixture.classList[0], ['custom']);
  });

});
