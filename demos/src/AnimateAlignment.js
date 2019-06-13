import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import EffectMixin from '../../src/EffectMixin.js';
import TransitionEffectMixin from '../../src/TransitionEffectMixin.js';
import ReactiveElement from '../../src/ReactiveElement.js';


const Base =
  EffectMixin(
  TransitionEffectMixin(
    ReactiveElement
  ));


export default class AnimateAlignment extends Base {

  get defaultState() {
    const base = Object.assign(super.defaultState, {
      align: 'left'
    });

    base.onChange('effectPhase', state => {
      if (state.effectPhase === 'after') {
        if (state.effect === 'slideLeft') {
          return {
            align: 'left'
          };
        } else if (state.effect === 'slideRight') {
          return {
            align: 'right'
          };
        }
      }
      return null;
    });

    return base;
  }

  get [symbols.elementsWithTransitions]() {
    return [this.$.container];
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    const { effect, effectPhase, enableEffects } = this.state;
    if ((changed.effect || changed.effectPhase || changed.enableEffects) &&
        enableEffects &&
        effect === 'slideLeft' || effect === 'slideRight') {
      const container = this.$.container;
      if (effectPhase === 'before') {
        // The inner container lets us measure how wide the content wants to be.
        const containerWidth = this.$.container.clientWidth;
        const distance = this.clientWidth - containerWidth;
        const transform = effect === 'slideLeft' ?
          `translateX(${distance}px)` :
          `translateX(-${distance}px)`;
        Object.assign(
          container.style,
          distance > 0 && {
            transform,
            transition: ''
          },
          effect === 'slideLeft' && {
            left: 0,
            right: ''
          },
          effect === 'slideRight' && {
            left: '',
            right: 0
          }
        );
      } else if (effectPhase === 'during') {
        Object.assign(container.style, {
          transform: 'translateX(0)',
          transition: 'transform 0.25s'
        });
      } else if (effectPhase === 'after') {
        Object.assign(container.style, {
          transform: '',
          transition: ''
        });
      }
    }    
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        #container {
          display: inline-block;
          position: absolute;
          will-change: transform;
        }
      </style>
      <div id="container">
        <slot></slot>
      </div>
    `;
  }

  toggleAlignment() {
    const effect = this.state.align === 'left' ?
      'slideRight' :
      'slideLeft';
    this[symbols.startEffect](effect);
  }

}


customElements.define('animate-alignment', AnimateAlignment);
