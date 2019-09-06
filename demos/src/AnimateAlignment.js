import * as internal from '../../src/internal.js';
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
    return this[internal.state].align;
  }
  set align(align) {
    if (this[internal.state].enableEffects && this[internal.state].align !== align) {
      const effect = align === 'left' ?
        'slideLeft' :
        'slideRight';
      this[internal.startEffect](effect);
    } else {
      this[internal.setState]({
        align
      });
    }
  }

  get [internal.defaultState]() {
    const base = Object.assign(super[internal.defaultState], {
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

  get [internal.elementsWithTransitions]() {
    return [this[internal.$].container];
  }

  [internal.render](changed) {
    super[internal.render](changed);
    const { align, effect, effectPhase, enableEffects } = this[internal.state];
    const container = this[internal.$].container;
    if ((changed.effect || changed.effectPhase || changed.enableEffects) &&
        enableEffects &&
        effect === 'slideLeft' || effect === 'slideRight') {
      if (effectPhase === 'before') {
        // The inner container lets us measure how wide the content wants to be.
        const containerWidth = this[internal.$].container.clientWidth;
        const distance = this[internal.$].stationary.clientWidth - containerWidth;
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

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: inline-flex;
        }

        #stationary {
          align-items: center;
          display: flex;
          flex: 1;
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
    const effect = this[internal.state].align === 'left' ?
      'slideRight' :
      'slideLeft';
    this[internal.startEffect](effect);
  }

}


customElements.define('animate-alignment', AnimateAlignment);
