import * as internal from '../../src/internal.js';
import AriaListMixin from '../../src/AriaListMixin.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import ReactiveElement from '../../src/ReactiveElement.js';


class AriaListTest extends
    AriaListMixin(ContentItemsMixin(ReactiveElement)) {

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }
    const content = [...this.children];
    this[internal.setState]({ content });
  }

}
customElements.define('aria-list-test', AriaListTest);


describe("AriaListMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("assigns default roles to list and items, and default IDs to items without IDs", async () => {
    const fixture = new AriaListTest();
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
    assert.isNotEmpty(item2.id); // implicitly assigned ID
    assert.equal(item2.getAttribute('role'), 'option'); // default role
  });

  it("indicates the selection state on both the list and the item", async () => {
    const fixture = new AriaListTest();
    const item1 = document.createElement('div');
    fixture.appendChild(item1);
    const item2 = document.createElement('div');
    fixture.appendChild(item2);
    container.appendChild(fixture);
    await fixture[internal.setState]({ selectedIndex: 0 });
    assert.equal(fixture.getAttribute('aria-activedescendant'), item1.id);
    assert.equal(item1.getAttribute('aria-selected'), 'true');
    assert.equal(item2.getAttribute('aria-selected'), 'false');
    await fixture[internal.setState]({ selectedIndex: 1 });
    assert.equal(fixture.getAttribute('aria-activedescendant'), item2.id);
    assert.equal(item1.getAttribute('aria-selected'), 'false');
    assert.equal(item2.getAttribute('aria-selected'), 'true');
  });

  it("assigns a default role of 'listbox'", () => {
    const fixture = new AriaListTest();
    fixture[internal.renderChanges]();
    assert.equal(fixture.getAttribute('role'), 'listbox');
  });

  it("doesn't overwrite an explicit role in markup", () => {
    container.innerHTML = `<aria-list-test role="tabs"></aria-list-test
  >`;
    const fixture = container.querySelector('aria-list-test');
    container.appendChild(fixture);
    assert.equal(fixture.getAttribute('role'), 'tabs');
  });

  it("doesn't apply default role to <option> items", async () => {
    const fixture = new AriaListTest();
    const item1 = document.createElement('option');
    const item2 = document.createElement('option');
    fixture.appendChild(item1);
    fixture.appendChild(item2);
    container.appendChild(fixture);
    await Promise.resolve();
    assert.isNull(item1.getAttribute('role'));
    assert.isNull(item2.getAttribute('role'));
  });

});
