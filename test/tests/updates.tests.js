import * as updates from '../../src/updates.js';


describe("updates helpers", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
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

});
