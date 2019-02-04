import DelegateFocusMixin from '../../src/DelegateFocusMixin.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';


class DelegateFocusTest extends DelegateFocusMixin(ReactiveElement) {

  get [symbols.template]() {
    return template.html`
      <input>
    `;
  }

}

customElements.define('delegate-focus-test', DelegateFocusTest);


describe("DelegateFocusMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("delegates focus to an inner element", () => {
    const fixture = new DelegateFocusTest();
    container.appendChild(fixture);
    fixture.focus();
    const activeElement = fixture.shadowRoot.activeElement;
    const input = fixture.shadowRoot.querySelector('input');
    assert.equal(activeElement, input);
  });

});
