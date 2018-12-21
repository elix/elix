import { merge } from './updates.js';
import * as symbols from './symbols.js';
import Dialog from './Dialog.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';
import EffectMixin from './EffectMixin.js';


const Base =
  LanguageDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
  EffectMixin(
  TransitionEffectMixin(
    Dialog
  )))));


/**
 * Modal panel that slides in from the side of the page
 * 
 * A drawer is a modal container generally used to provide navigation in
 * situations where: a) screen real estate is constrained and b) the navigation
 * UI is not critical to completing the user’s primary goal (and, hence, not
 * critical to the application’s business goal).
 * 
 * @inherits Dialog
 * @mixes LanguageDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @mixes EffectMixin
 * @mixes TransitionEffectMixin
 */
class Drawer extends Base {
  
  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', async () => {
      this[symbols.raiseChangeEvents] = true;
      await this.close();
      this[symbols.raiseChangeEvents] = false;
    });
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      fromEdge: 'start',
      selectedIndex: 0
    });
  }

  get [symbols.elementsWithTransitions]() {
    return [this.$.backdrop, this.$.frame];
  }

  /**
   * The edge from which the drawer will appear, in terms of the drawer's
   * container.
   * 
   * The `start` and `end` values refer to text direction: in left-to-right
   * languages such as English, these are equivalent to `left` and `right`,
   * respectively.
   * 
   * @type {('end'|'left'|'right'|'start')}
   * @default 'start'
   */
  get fromEdge() {
    return this.state.fromEdge;
  }
  set fromEdge(fromEdge) {
    this.setState({ fromEdge });
  }

  async [symbols.swipeLeft]() {
    if (drawerAppearsFromLeftEdge(this)) {
      this.setState({
        effect: 'close',
        effectPhase: 'during'
      });
      await this.close();
    }
  }
  
  async [symbols.swipeRight]() {
    if (!drawerAppearsFromLeftEdge(this)) {
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

  get updates() {
    const base = super.updates || {};

    const effect = this.state.effect;
    const phase = this.state.effectPhase;
    const opened = (effect === 'open' && phase !== 'before') ||
      (effect === 'close' && phase === 'before');

    const fromEdge = this.fromEdge;
    const rightToLeft = this[symbols.rightToLeft];
    const fromLeftEdge = drawerAppearsFromLeftEdge(this);

    const sign = fromLeftEdge ? -1 : 1;
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
    const showTransition = this.state.enableEffects && !swiping && 
        effect && phase === 'during';
    if (showTransition) {
      // The time require to show transitions depends on how far apart the
      // elements currently are from their desired state. As a reference point,
      // we compare the expected opacity of the backdrop to its current opacity.
      // (We can't use the swipeFraction, because no swipe is in progress.)
      /** @type {any} */
      const backdrop = this.$.backdrop;
      const opacityCurrent = parseFloat(backdrop.style.opacity) || 0;
      const opacityRemaining = Math.abs(opacityCurrent - opacity);
      const fullDuration = 0.25; // Quarter second
      duration = opacityRemaining / maxOpacity * fullDuration;
    }

    const backdropProps = {
      style: {
        opacity,
        'transition': showTransition ? `opacity ${duration}s linear` : undefined,
        'will-change': 'opacity'
      }
    };

    const transform = `translateX(${translatePercentage}%)`;
    const frameProps = {
      style: {
        transform,
        'transition': showTransition ? `transform ${duration}s` : undefined,
        'will-change': 'opacity'
      }
    };

    // Style for top-level element
    const mapFromEdgetoJustifyContent = {
      'end': 'flex-end',
      'left': rightToLeft ? 'flex-end' : 'flex-start',
      'right': rightToLeft ? 'flex-start' : 'flex-end',
      'start': 'flex-start'
    };
    const justifyContent = mapFromEdgetoJustifyContent[fromEdge];

    const style = {
      'align-items': 'stretch',
      'flex-direction': 'row',
      'justify-content': justifyContent
    }

    return merge(base, {
      style,
      $: {
        backdrop: backdropProps,
        frame: frameProps
      }
    });
  }

}


function drawerAppearsFromLeftEdge(element) {
  const fromEdge = element.fromEdge;
  const rightToLeft = element[symbols.rightToLeft];
  return fromEdge === 'left' ||
    fromEdge === 'start' && !rightToLeft ||
    fromEdge === 'end' && rightToLeft;
}


customElements.define('elix-drawer', Drawer);
export default Drawer;
