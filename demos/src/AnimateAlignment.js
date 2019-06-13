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

  get align() {
    return this.state.align;
  }
  set align(align) {
    this.setState({
      align
    });
  }

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
    const { align, effect, effectPhase, enableEffects } = this.state;
    const container = this.$.container;
    if ((changed.effect || changed.effectPhase || changed.enableEffects) &&
        enableEffects &&
        effect === 'slideLeft' || effect === 'slideRight') {
      if (effectPhase === 'before') {
        // The inner container lets us measure how wide the content wants to be.
        const containerWidth = this.$.container.clientWidth;
        const distance = this.$.stationary.clientWidth - containerWidth;
        const transform = effect === 'slideLeft' ?
          `translateX(${distance}px)` :
          `translateX(-${distance}px)`;
        Object.assign(
          container.style,
          distance > 0 && {
            transform,
            transition: ''
          }
        );
        container.classList.toggle('right', effect === 'slideRight');
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
    if (changed.align && !enableEffects) {
      // Align without animation
      container.classList.toggle('right', align === 'right');
    }
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }

        #stationary {
          position: relative;
        }

        #container {
          display: inline-block;
          left: 0;
          position: absolute;
          will-change: transform;
        }

        #container.right {
          left: initial;
          right: 0;
        }
      </style>
      <div id="stationary">
        <div id="container">
          <slot></slot>
        </div>
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
