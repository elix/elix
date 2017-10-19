import flushPolyfills from '../flushPolyfills.js';
import ContentItemsMixin from '../../mixins/ContentItemsMixin.js';
import HostPropsMixin from '../../mixins/HostPropsMixin.js'
import ReactiveMixin from '../../mixins/ReactiveMixin.js'
import SelectionAriaMixin from '../../mixins/SelectionAriaMixin.js';
import symbols from '../../mixins/symbols.js';


class SelectionAriaTest extends
  ContentItemsMixin(HostPropsMixin(ReactiveMixin(SelectionAriaMixin(HTMLElement)))) {

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }
    // Convert children to array in a way IE 11 can handle.
    const content = Array.prototype.slice.call(this.children);
    this.setState({ content });
  }

}
customElements.define('selection-aria-test', SelectionAriaTest);


describe("SelectionAriaMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("assigns default roles to list and items, and default IDs to items without IDs", async () => {
    const fixture = new SelectionAriaTest();;
    fixture.id = 'test'; // Will be used as basis for assigned item IDs.
    const item1 = document.createElement('div');
    item1.id = 'explicitID';
    fixture.appendChild(item1);
    // Leave item2 without an ID.
    const item2 = document.createElement('div');
    fixture.appendChild(item2);
    container.appendChild(fixture);
    await Promise.resolve();
    assert.equal(fixture.getAttribute('role'), 'listbox'); // default role
    assert.equal(item1.id, 'explicitID'); // unchanged
    assert.equal(item1.getAttribute('role'), 'option'); // default role
    const expectedIdStart = '_testOption';
    const idStart = item2.id.slice(0, expectedIdStart.length);
    assert.equal(idStart, expectedIdStart); // implicitly assigned ID
    assert.equal(item2.getAttribute('role'), 'option'); // default role
  });

  it("indicates the selection state on both the list and the item", async () => {
    const fixture = new SelectionAriaTest();;
    const item1 = document.createElement('div');
    fixture.appendChild(item1);
    const item2 = document.createElement('div');
    fixture.appendChild(item2);
    container.appendChild(fixture);
    await fixture.setState({ selectedIndex: 0 });
    assert.equal(fixture.getAttribute('aria-activedescendant'), item1.id);
    assert.equal(item1.getAttribute('aria-selected'), 'true');
    assert.equal(item2.getAttribute('aria-selected'), 'false');
    await fixture.setState({ selectedIndex: 1 });
    assert.equal(fixture.getAttribute('aria-activedescendant'), item2.id);
    assert.equal(item1.getAttribute('aria-selected'), 'false');
    assert.equal(item2.getAttribute('aria-selected'), 'true');
  });

  it("assigns a default role of 'listbox'", () => {
    const fixture = new SelectionAriaTest();;
    fixture.render();
    assert.equal(fixture.getAttribute('role'), 'listbox');
  });

  it("doesn't overwrite an explicit role in markup", () => {
    container.innerHTML = `<selection-aria-test role="tabs"></selection-aria-test>`;
    const fixture = container.querySelector('selection-aria-test');
    container.appendChild(fixture);
    assert.equal(fixture.getAttribute('role'), 'tabs');
  });

});
