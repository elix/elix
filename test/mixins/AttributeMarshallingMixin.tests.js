import AttributeMarshallingMixin from '../../mixins/AttributeMarshallingMixin.js';


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
  }

}
customElements.define('element-with-custom-property', ElementWithCustomProperty);


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

});
