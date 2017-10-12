import { assert } from 'chai';
import flushPolyfills from '../../test/flushPolyfills.js';
import KeyboardMixin from '../../mixins/KeyboardMixin.js';
import * as mockInteractions from '../../test/mockInteractions.js';
import ReactiveMixin from '../../mixins/ReactiveMixin.js'
import symbols from '../../mixins/symbols.js';


class KeyboardTest extends KeyboardMixin(ReactiveMixin(HTMLElement)) {
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
    const fixture = document.createElement('keyboard-test');
    fixture.render()
    .then(() => {
      assert.equal(fixture.getAttribute('tabindex'), '0');
    });
  });

  it("doesn't overwrite an explicit tabindex in markup", () => {
    container.innerHTML = `<keyboard-test tabindex="1"></keyboard-test>`;
    const fixture = container.querySelector('keyboard-test');
    assert.equal(fixture.getAttribute('tabindex'), '1');
  });

  it("listens to keydown and fires the keydown() method", done => {
    const fixture = document.createElement('keyboard-test');
    fixture[symbols.keydown] = (event) => {
      done();
    };
    container.appendChild(fixture);
    mockInteractions.dispatchSyntheticKeyboardEvent(fixture, 'keydown');
  });

});
