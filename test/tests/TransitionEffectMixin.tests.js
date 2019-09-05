import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import TransitionEffectMixin from '../../src/TransitionEffectMixin.js';


const Base =
  TransitionEffectMixin(
    ReactiveElement
  );

// An element with open and close effects. When completely closed, the element
// is hidden. We test both effects because we can encounter different conditions
// when showing or hiding an element during an effect.
class TransitionEffectTest extends Base {

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], {
      effect: 'close',
      effectPhase: 'after'
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    const effect = this.state.effect;
    const phase = this.state.effectPhase;
    const display = effect === 'close' && phase === 'after' ?
      'none' :
      'block';
    const opacity = (effect === 'open' && phase !== 'before') ||
        (effect === 'close' && phase === 'before') ?
      1 :
      0;
    Object.assign(this.style, {
      display,
      opacity
    });
  }
  
  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          transition: opacity 0.01s;
        }
      </style>
    `;
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
