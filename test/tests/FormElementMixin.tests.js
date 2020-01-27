import { assert } from '../test-helpers.js';
import * as internal from "../../src/internal.js";
import FormElementMixin from "../../src/FormElementMixin.js";
import ReactiveElement from "../../src/ReactiveElement.js";

const formElementsSupported = "ElementInternals" in window;

class FormElementTest extends FormElementMixin(ReactiveElement) {
  get [internal.defaultState]() {
    const result = Object.assign(super[internal.defaultState], {
      value: null
    });

    result.onChange("value", state => {
      const valid = state.value !== null && state.value !== "";
      const validationMessage = valid ? "" : `Can't be empty`;
      return {
        valid,
        validationMessage
      };
    });

    return result;
  }

  get value() {
    return this[internal.state].value;
  }
  set value(value) {
    this[internal.setState]({ value });
  }
}
customElements.define("form-element-test", FormElementTest);

(formElementsSupported ? describe : describe.skip)("FormElementMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("associates with a form", () => {
    const fixture = new FormElementTest();
    const form = document.createElement("form");
    form.append(fixture);
    assert.equal(fixture.form, form);
    const elements = form.elements;
    assert.equal(elements.length, 1);
    assert.equal(elements[0], fixture);
  });

  it("includes its value in form submission", done => {
    const fixture = new FormElementTest();
    fixture.name = "animal";
    const form = document.createElement("form");
    form.action = "about:blank";
    form.target = "result";
    const resultFrame = document.createElement("iframe");
    resultFrame.name = "result";
    form.append(fixture);
    container.append(form, resultFrame);
    fixture.value = "aardvark";
    fixture[internal.renderChanges]();
    form.addEventListener("formdata", event => {
      assert(event["formData"].get("animal"), "aardvark");
      done();
    });
    form.submit();
  });

  it("participates in validation", () => {
    const fixture = new FormElementTest();
    fixture[internal.renderChanges]();
    assert.isFalse(fixture.checkValidity());
    fixture.value = "bandicoot";
    fixture[internal.renderChanges]();
    assert(fixture.checkValidity());
  });
});
