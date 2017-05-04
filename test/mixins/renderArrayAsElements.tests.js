import { assert } from 'chai';
import renderArrayAsElements from '../../mixins/renderArrayAsElements.js';


function renderItemAsDiv(item, element) {
  if (!element || element.localName !== 'div') {
    element = document.createElement('div');
  }
  element.textContent = item;
  return element;
}


describe("renderArrayAsElements", () => {

  it("generates new elements for array items", () => {
    const container = document.createElement('div');
    const items = [1, 2, 3];
    renderArrayAsElements(items, container, renderItemAsDiv);
    assert.equal(container.innerHTML, `<div>1</div><div>2</div><div>3</div>`);
  });

  it("reuses elements when rendering array items", () => {
    const container = document.createElement('div');
    container.innerHTML = `<div>foo</div><div>bar</div>`;
    const foo = container.children[0];
    const bar = container.children[1];
    const items = [1, 2, 3];
    renderArrayAsElements(items, container, renderItemAsDiv);
    assert.equal(container.innerHTML, `<div>1</div><div>2</div><div>3</div>`);
    assert.equal(container.children[0], foo);
    assert.equal(container.children[1], bar);
  });

  it("trims elements which are no longer needed", () => {
    const container = document.createElement('div');
    container.innerHTML = `<div>1</div><div>2</div><div>3</div>`;
    const items = [1, 2];
    renderArrayAsElements(items, container, renderItemAsDiv);
    assert.equal(container.innerHTML, `<div>1</div><div>2</div>`);
  });

  it("replaces elements which can't be reused", () => {
    const container = document.createElement('div');
    container.innerHTML = `<span>1</span><em>2</em><div>3</div>`;
    const div = container.children[2];
    const items = [1, 2, 3];
    renderArrayAsElements(items, container, renderItemAsDiv);
    assert.equal(container.innerHTML, `<div>1</div><div>2</div><div>3</div>`);
    assert.equal(container.children[2], div);
  });

});
