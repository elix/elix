import './ModalBackdrop.js';
import './OverlayFrame.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import ReactiveElement from './ReactiveElement.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';


const backdropTagKey = Symbol('backdropTag');
const frameTagKey = Symbol('frameTag');


const Base =
  DialogModalityMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  OpenCloseMixin(
  OverlayMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
  TransitionEffectMixin(
    ReactiveElement
  ))))))));


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
 * @inherits ReactiveElement
 * @mixes DialogModalityMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @mixes TransitionEffectMixin
 * @elementtag {ModalBackdrop} backdrop
 * @elementtag {OverlayFrame} frame
 */
class Drawer extends Base {

  get backdropTag() {
    return this[backdropTagKey];
  }
  set backdropTag(backdropTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[backdropTagKey] = backdropTag;
  }
  
  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', async () => {
      this[symbols.raiseChangeEvents] = true;
      await this.close();
      this[symbols.raiseChangeEvents] = false;
    });

    // Once everything's finished rendering, enable transition effects.
    setTimeout(() => {
      this.setState({
        enableTransitions: true
      });
    });
  }

  get defaults() {
    return {
      tags: {
        backdrop: 'elix-modal-backdrop',
        frame: 'elix-overlay-frame'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      enableTransitions: false,
      selectedIndex: 0
    });
  }

  get [symbols.elementsWithTransitions]() {
    return [this.$.backdrop, this.$.frame];
  }

  get frameTag() {
    return this[frameTagKey];
  }
  set frameTag(frameTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[frameTagKey] = frameTag;
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
    /** @type {any} */
    const element = this.$.frame;
    return element;
  }

  get [symbols.template]() {
    const backdropTag = this.backdropTag || this.defaults.tags.backdrop;
    const frameTag = this.frameTag || this.defaults.tags.frame;
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

        #frame {
          will-change: transform;
        }
      </style>
      <${backdropTag} id="backdrop"></${backdropTag}>
      <${frameTag} id="frame">
        <slot></slot>
      </${frameTag}>
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
    const showTransition = this.state.enableTransitions && !swiping && 
        effect && phase === 'during';
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
    const frameProps = {
      style: {
        transform,
        'transition': showTransition ? `transform ${duration}s` : undefined
      }
    };

    return merge(base, {
      $: {
        backdrop: backdropProps,
        frame: frameProps
      }
    });
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
