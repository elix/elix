import * as mockInteractions from '../mockInteractions.js';
import * as symbols from '../../src/symbols.js';
import KeyboardMixin from '../../src/KeyboardMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js'
import RenderUpdatesMixin from '../../src/RenderUpdatesMixin.js'


class KeyboardTest extends KeyboardMixin(ReactiveMixin(RenderUpdatesMixin(HTMLElement))) {
  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }
    this.render();
  }
}
customElements.define('keyboard-test', KeyboardTest);


describe("KeyboardMixin", () => {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it("assigns a tabindex of 0 by default", () => {
    const fixture = new KeyboardTest();
    fixture.render();
    assert.equal(fixture.getAttribute('tabindex'), '0');
  });

  it("doesn't overwrite an explicit tabindex in markup", async () => {
    container.innerHTML = `<keyboard-test tabindex="1"></keyboard-test>`;
    const fixture = container.querySelector('keyboard-test');
    await Promise.resolve();
    assert.equal(fixture.getAttribute('tabindex'), '1');
  });

  it("reflects tabindex attribute and tabIndex property assignments in state", async () => {
    const fixture = new KeyboardTest();
    fixture.render();
    assert.equal(fixture.state.tabIndex, 0);
    fixture.setAttribute('tabindex', '1');
    fixture.render();
    assert.equal(fixture.state.tabIndex, 1);
    assert.equal(fixture.tabIndex, 1);
    fixture.tabIndex = 2;
    assert.equal(fixture.state.tabIndex, 2);
    assert.equal(fixture.getAttribute('tabindex'), 2);
  });

  it("listens to keydown and fires the keydown() method", done => {
    const fixture = new KeyboardTest();
    fixture[symbols.keydown] = () => {
      done();
    };
    container.appendChild(fixture);
    mockInteractions.dispatchSyntheticKeyboardEvent(fixture, 'keydown');
  });

});
