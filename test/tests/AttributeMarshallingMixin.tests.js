import { assert } from '../test-helpers.js';
import AttributeMarshallingMixin from "../../src/AttributeMarshallingMixin.js";

let defaultPropertyValue;

/* Element with camelCase property name */
class ElementWithCustomProperty extends AttributeMarshallingMixin(HTMLElement) {
  constructor() {
    super();
    if (typeof defaultPropertyValue !== "undefined") {
      this.customProperty = defaultPropertyValue;
    }
  }

  get customProperty() {
    return this._customProperty;
  }
  set customProperty(value) {
    this._customProperty = value;
  }

  get disabled() {
    return this._disabled;
  }
  set disabled(disabled) {
    this._disabled = disabled;
  }
}
customElements.define(
  "element-with-custom-property",
  ElementWithCustomProperty
);

describe("AttributeMarshallingMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
    defaultPropertyValue = undefined;
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("defines observedAttributes for all custom property setters", () => {
    assert.deepNestedPropertyVal(ElementWithCustomProperty, "observedAttributes", ["custom-property", "disabled"]);
  });

  it("marshals hyphenated attribute to corresponding camelCase property", () => {
    const fixture = new ElementWithCustomProperty();
    assert.isUndefined(fixture.customProperty);
    fixture.setAttribute("custom-property", "Hello");
    assert.equal(fixture.customProperty, "Hello");
  });

  it("translates boolean attribute string|null to boolean value", () => {
    const fixture = new ElementWithCustomProperty();
    fixture.setAttribute("disabled", "");
    assert(fixture.disabled);
    fixture.removeAttribute("disabled");
    assert(!fixture.disabled);
  });
});
