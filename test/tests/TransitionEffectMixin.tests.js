import { merge } from '../../src/updates.js';
import TransitionEffectMixin from '../../src/TransitionEffectMixin.js';
import ElementBase from '../../src/ElementBase.js';
import symbols from '../../src/symbols.js';


const Base =
  TransitionEffectMixin(
    ElementBase
  );

// An element with open and close effects. When completely closed, the element
// is hidden. We test both effects because we can encounter different conditions
// when showing or hiding an element during an effect.
class TransitionEffectTest extends Base {

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
    const display = effect === null || (effect === 'close' && phase === 'after') ?
      'none' :
      'block';
    const opacity = (effect === 'open' && phase !== 'before') ||
        (effect === 'close' && phase === 'before') ?
      1 :
      0;
    return {
      style: {
        display,
        opacity
      }
    };
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
    container.append(fixture);
    const states = [];
    fixture.addEventListener('effect-phase-changed', event => {
      states.push(event.detail.effectPhase);
      if (event.detail.effectPhase === 'after') {
        assert.deepEqual(states, ['before', 'during', 'after']);
        done();
      }
    })
    fixture.startEffect('open');
  });
  
  it('goes through effect phases when closed', done => {
    const fixture = new TransitionEffectTest();
    fixture.opened = true;
    container.append(fixture);
    const states = [];
    fixture.addEventListener('effect-phase-changed', event => {
      states.push(event.detail.effectPhase);
      if (event.detail.effectPhase === 'after') {
        assert.deepEqual(states, ['before', 'during', 'after']);
        done();
      }
    });
    fixture.startEffect('close');
  });

});
