import { merge } from './updates.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import './ModalBackdrop.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import symbols from './symbols.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';
import ElementBase from './ElementBase.js';


const Base =
  DialogModalityMixin(
  FocusCaptureMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  OpenCloseMixin(
  OverlayMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
  TransitionEffectMixin(
    ElementBase
  )))))))));


/**
 * A drawer is a modal container generally used to provide navigation in
 * situations where: a) screen real estate is constrained and b) the navigation
 * UI is not critical to completing the user’s primary goal (and, hence, not
 * critical to the application’s business goal).
 * 
 * Drawer displays a [ModalBackdrop](ModalBackdrop) behind the main overlay
 * content to help the user understand the modal condition. Both the backdrop
 * and the dialog itself can be styled.
 * 
 * @inherits ElementBase
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @mixes TransitionEffectMixin
 */
class Drawer extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedIndex: 0
    });
  }

  get [symbols.elementsWithTransitions]() {
    return [this.$.backdrop, this.$.content];
  }

  async [symbols.swipeLeft]() {
    if (!this[symbols.rightToLeft]) {
      this.setState({
        effect: 'close',
        effectPhase: 'during'
      });
      await this.close();
    }
  }
  
  async [symbols.swipeRight]() {
    if (this[symbols.rightToLeft]) {
      this.setState({
        effect: 'close',
        effectPhase: 'during'
      });
      await this.close();
    }
  }

  get [symbols.swipeTarget]() {
    return this.$.content;
  }

  get [symbols.template]() {
    // See z-index notes at Dialog.js.
    return `
      <style>
        :host {
          align-items: stretch;
          display: flex;
          flex-direction: row;
          left: 0;
          height: 100%;
          justify-content: flex-start;
          outline: none;
          position: fixed;
          top: 0;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }

        #backdrop {
          will-change: opacity;
        }

        #content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          position: relative;
          will-change: transform;
          z-index: 1;
        }
      </style>
      ${FocusCaptureMixin.wrap(`
        <div id="content">
          <slot></slot>
        </div>
      `)}
      <elix-modal-backdrop id="backdrop"></elix-modal-backdrop>
    `;
  }

  get updates() {
    const base = super.updates || {};

    const effect = this.state.effect;
    const phase = this.state.effectPhase;
    const opened = (effect === 'open' && phase !== 'before') ||
      (effect === 'close' && phase === 'before');

      const sign = this[symbols.rightToLeft] ? 1 : -1;
    const swiping = this.state.swipeFraction !== null;
    // Constrain the distance swiped to between 0 and a bit less than 1. A swipe
    // distance of 1 itself would cause a tricky problem. The drawer would
    // render itself completely off screen. This means the expected CSS
    // transition would not occur, so the transitionend event wouldn't fire,
    // leaving us waiting indefinitely for an event that will never come. By
    // ensuring we always transition at least a tiny bit, we guarantee that a
    // transition and its accompanying event will occur.
    const swipeFraction = swiping ?
      Math.max(Math.min(sign * this.state.swipeFraction, 0.999), 0) :
      0;
    const maxOpacity = 0.2;
    const opacity = opened ?
      maxOpacity * (1 - swipeFraction) :
      0;

    const translateFraction = opened ?
      swipeFraction :
      1;
    const translatePercentage = sign * translateFraction * 100;

    let duration = 0;
    const showTransition = !swiping && effect && phase === 'during';
    if (showTransition) {
      // The time require to show transitions depends on how far apart the
      // elements currently are from their desired state. As a reference point,
      // we compare the expected opacity of the backdrop to its current opacity.
      // (We can't use the swipeFraction, because no swipe is in progress.)
      /** @type {any} */
      const backdrop = this.$.backdrop;
      const opacityCurrent = parseFloat(backdrop.style.opacity) || 0;
      // const opacityStart = effect === 'open' ? 0 : maxOpacity;
      // const opacityEnd = opacity;
      // const opacityRange = Math.abs(opacityEnd - opacityStart);
      // const opacityProgress = Math.abs(opacityCurrent - opacityStart) / opacityRange;
      const opacityRemaining = Math.abs(opacityCurrent - opacity);
      const fullDuration = 0.25; // Quarter second
      duration = opacityRemaining / maxOpacity * fullDuration;
    }

    const backdropProps = {
      style: {
        opacity,
        'transition': showTransition ? `opacity ${duration}s linear` : undefined
      }
    };

    const transform = `translateX(${translatePercentage}%)`;
    const contentProps = {
      style: {
        transform,
        'transition': showTransition ? `transform ${duration}s` : undefined
      }
    };

    return merge(base, {
      $: {
        backdrop: backdropProps,
        content: contentProps
      }
    });
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
