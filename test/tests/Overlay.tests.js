import Overlay from '../../src/Overlay.js';


describe("Overlay", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it('appends overlay to body if it not already present, removes it when done', async () => {
    const fixture = new Overlay();
    assert.equal(fixture.parentNode, null);
    await fixture.open();
    assert.equal(fixture.parentNode, document.body);
    await fixture.close();
    assert.equal(fixture.parentNode, null);
  });

  it('leaves overlay where it is, if it is already in the DOM', async () => {
    const div = document.createElement('div');
    const fixture = new Overlay();
    div.appendChild(fixture);
    container.appendChild(div);
    await fixture.open();
    assert.equal(fixture.parentNode, div);
    await fixture.close();
    assert.equal(fixture.parentNode, div);
  });

});
