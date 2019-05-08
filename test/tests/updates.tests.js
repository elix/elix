import * as updates from '../../src/updates.js';


describe("updates helpers", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("updates.applyClasses turns multiple classes on or off", () => {
    const fixture = document.createElement('div');
    updates.applyClasses(fixture, { 'foo': true, 'bar': true });
    assert(fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
    updates.applyClasses(fixture, { 'foo': false });
    assert(!fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
  });

  it("updates.apply merges new updates on top of existing attributes", () => {
    container.innerHTML = `
      <div class="foo bar" style="color: red;" aria-selected="false"></div>
    `;
    const fixture = container.children[0];
    updates.apply(fixture, {
      attributes: {
        'aria-selected': 'true'
      },
      classes: {
        foo: false,
        bletch: true
      },
      style: {
        color: 'green'
      }
    });
    assert.equal(fixture.getAttribute('aria-selected'), 'true');
    assert(!fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
    assert(fixture.classList.contains('bletch'));
    assert.equal(fixture.style.color, 'green');
  });

  it("updates.applyAttribute handles regular attributes", () => {
    const fixture = document.createElement('div');
    updates.applyAttribute(fixture, 'aria-selected', 'true');
    assert.equal(fixture.getAttribute('aria-selected'), 'true');
    updates.applyAttribute(fixture, 'aria-selected', null);
    assert.equal(fixture.getAttribute('aria-selected'), null);
  });

  it("updates.applyAttribute handles boolean attributes", () => {
    const fixture = document.createElement('button');
    updates.applyAttribute(fixture, 'disabled', true);
    assert.equal(fixture.disabled, true);
    updates.applyAttribute(fixture, 'disabled', false);
    assert.equal(fixture.disabled, false);
  });

  it("updates.applyChildNodes updates child nodes", () => {
    const fixture = document.createElement('div');
    const existingChild = document.createTextNode('existing');
    fixture.appendChild(existingChild);
    const nodes = [
      document.createTextNode('one'),
      document.createTextNode('two')
    ];
    updates.applyChildNodes(fixture, nodes);
    assert.equal(fixture.childNodes.length, 2);
    assert.equal(fixture.childNodes[0], nodes[0]);
    assert.equal(fixture.childNodes[1], nodes[1]);
    assert.isNull(existingChild.parentNode);
  });

  it("updates.apply with childNodes updates child nodes", () => {
    const fixture = document.createElement('div');
    const existingChild = document.createTextNode('existing');
    fixture.appendChild(existingChild);
    const nodes = [
      document.createTextNode('one'),
      document.createTextNode('two')
    ];
    updates.apply(fixture, {
      childNodes: nodes
    });
    assert.equal(fixture.childNodes.length, 2);
    assert.equal(fixture.childNodes[0], nodes[0]);
    assert.equal(fixture.childNodes[1], nodes[1]);
    assert.isNull(existingChild.parentNode);
  });

  it("updates.apply removes extra child nodes", () => {
    const fixture = document.createElement('div');
    const nodes = [
      document.createTextNode('one'),
      document.createTextNode('two')
    ];
    updates.apply(fixture, {
      childNodes: nodes
    });
    assert.equal(fixture.childNodes.length, 2);
    updates.apply(fixture, {
      childNodes: []
    });
    assert.equal(fixture.childNodes.length, 0);
  });

  it("updates applies $ updates to referenced elements", () => {
    const fixture = document.createElement('div');
    fixture.$ = {
      child: document.createElement('button')
    };
    fixture.appendChild(fixture.$.child);
    updates.apply(fixture, {
      $: {
        child: {
          attributes: {
            'aria-label': 'Label',
            disabled: true
          }
        }
      }
    });
    assert(fixture.$.child.disabled);
    assert.equal(fixture.$.child.getAttribute('aria-label'), 'Label');
  });

  it("can apply updates to an element-valued property", () => {
    const fixture = document.createElement('div');
    const button = document.createElement('button');
    fixture.button = button;
    updates.apply(fixture, {
      button: {
        disabled: true
      }
    });
    assert.equal(fixture.button, button);
    assert(fixture.button.disabled);
  });

});
