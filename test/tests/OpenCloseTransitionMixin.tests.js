import { merge } from '../../src/updates.js';
import OpenCloseTransitionMixin from '../../src/OpenCloseTransitionMixin.js';
import ElementBase from '../../src/ElementBase.js';
import symbols from '../../src/symbols.js';


const Base =
  OpenCloseTransitionMixin(
    ElementBase
  );

class OpenCloseTransitionTest extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
          transition: opacity 0.01s;
        }
      </style>
    `;
  }

  get updates() {
    const visualState = this.state.visualState;
    return {
      style: {
        display: this.closed ? 'none' : 'block',
        opacity: this.opened ? 1 : 0
      }
    };
  }
}
customElements.define('open-close-transition-test', OpenCloseTransitionTest);


describe("OpenCloseTransitionMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it('generates sequence of visual states when opened', done => {
    const fixture = new OpenCloseTransitionTest();
    container.append(fixture);
    const states = [];
    fixture.addEventListener('visual-state-changed', event => {
      states.push(event.detail.visualState);
      if (event.detail.visualState === 'opened') {
        assert.deepEqual(states, ['opening', 'opened']);
        done();
      }
    })
    fixture.startOpen();
  });

  it('generates sequence of visual states when closed', done => {
    const fixture = new OpenCloseTransitionTest();
    fixture.opened = true;
    container.append(fixture);
    const states = [];
    fixture.addEventListener('visual-state-changed', event => {
      states.push(event.detail.visualState);
      if (event.detail.visualState === 'closed') {
        assert.deepEqual(states, ['closing', 'closed']);
        done();
      }
    });
    setTimeout(() => {
      fixture.startClose();
    });
  });

});
