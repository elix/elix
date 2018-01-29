import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import ElementBase from '../../src/ElementBase.js';
import TransitionEffectMixin from '../../src/TransitionEffectMixin.js';


const Base =
  TransitionEffectMixin(
    ElementBase
  );

// An element with open and close effects. When completely closed, the element
// is hidden. We test both effects because we can encounter different conditions
// when showing or hiding an element during an effect.
class TransitionEffectTest extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      effect: 'close',
      effectPhase: 'after'
    });
  }

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
    const effect = this.state.effect;
    const phase = this.state.effectPhase;
    const display = effect === 'close' && phase === 'after' ?
      'none' :
      'block';
    const opacity = (effect === 'open' && phase !== 'before') ||
        (effect === 'close' && phase === 'before') ?
      1 :
      0;
    return merge(super.updates, {
      style: {
        display,
        opacity
      }
    });
  }
}
customElements.define('transition-effect-test', TransitionEffectTest);


describe("TransitionEffectMixin", function () {

  let container;

  before(() => {
    container = document.getElementById('container');
  });

  afterEach(() => {
    container.innerHTML = '';
  });

  it('goes through effect phases when opened', done => {
    const fixture = new TransitionEffectTest();
    container.appendChild(fixture);
    const states = [];
    fixture.addEventListener('effect-phase-changed', event => {
      states.push(event.detail.effectPhase);
      if (event.detail.effectPhase === 'after') {
        assert.deepEqual(states, ['before', 'during', 'after']);
        done();
      }
    });
    fixture[symbols.startEffect]('open');
  });
  
  it('goes through effect phases when closed', done => {
    const fixture = new TransitionEffectTest();
    fixture.opened = true;
    container.appendChild(fixture);
    const states = [];
    fixture.addEventListener('effect-phase-changed', event => {
      states.push(event.detail.effectPhase);
      if (event.detail.effectPhase === 'after') {
        assert.deepEqual(states, ['before', 'during', 'after']);
        done();
      }
    });
    fixture[symbols.startEffect]('close');
  });

});
