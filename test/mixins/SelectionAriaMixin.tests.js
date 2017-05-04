import { assert } from 'chai';
import flushPolyfills from '../../test/flushPolyfills.js';
import SelectionAriaMixin from '../../mixins//SelectionAriaMixin.js';
import SingleSelectionMixin from '../../mixins//SingleSelectionMixin.js';
import symbols from '../../mixins//symbols.js';


class SelectionAriaActiveTest extends SelectionAriaMixin(SingleSelectionMixin(HTMLElement)) {
  get items() {
    // Convert children to array in a way IE 11 can handle.
    return Array.prototype.slice.call(this.children);
  }
}
customElements.define('selection-aria-test', SelectionAriaActiveTest);


describe("SelectionAriaMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("assigns default roles to list and items, and default IDs to items without IDs", () => {
    const fixture = document.createElement('selection-aria-test');
    fixture.id = 'test'; // Will be used as basis for assigned item IDs.
    const item1 = document.createElement('div');
    item1.id = 'explicitID';
    fixture.appendChild(item1);
    const item2 = document.createElement('div');
    // Leave item2 without an ID.
    fixture.appendChild(item2);
    // Initialize items using private API.
    fixture[symbols.itemAdded](item1);
    fixture[symbols.itemAdded](item2);
    container.appendChild(fixture);
    flushPolyfills();
    assert.equal(fixture.getAttribute('role'), 'listbox'); // default role
    assert.equal(item1.id, 'explicitID'); // unchanged
    assert.equal(item1.getAttribute('role'), 'option'); // default role
    const expectedIdStart = '_testOption';
    const idStart = item2.id.slice(0, expectedIdStart.length);
    assert.equal(idStart, expectedIdStart); // implicitly assigned ID
    assert.equal(item2.getAttribute('role'), 'option'); // default role
  });

  it("indicates the selection state on both the list and the item", () => {
    const fixture = document.createElement('selection-aria-test');
    const item1 = document.createElement('div');
    fixture.appendChild(item1);
    const item2 = document.createElement('div');
    fixture.appendChild(item2);
    // Initialize items using private API.
    fixture[symbols.itemAdded](item1);
    fixture[symbols.itemAdded](item2);
    fixture.selectedItem = item1;
    assert.equal(fixture.getAttribute('aria-activedescendant'), item1.id);
    assert.equal(item1.getAttribute('aria-selected'), 'true');
    assert.equal(item2.getAttribute('aria-selected'), 'false');
    fixture.selectedItem = item2;
    assert.equal(fixture.getAttribute('aria-activedescendant'), item2.id);
    assert.equal(item1.getAttribute('aria-selected'), 'false');
    assert.equal(item2.getAttribute('aria-selected'), 'true');
  });

  it("assigns a default role of 'listbox'", () => {
    const fixture = document.createElement('selection-aria-test');
    container.appendChild(fixture);
    flushPolyfills();
    assert.equal(fixture.getAttribute('role'), 'listbox');
  });

  it("doesn't overwrite an explicit role", () => {
    const fixture = document.createElement('selection-aria-test');
    fixture.setAttribute('role', 'tabs');
    container.appendChild(fixture);
    assert.equal(fixture.getAttribute('role'), 'tabs');
  });

});
