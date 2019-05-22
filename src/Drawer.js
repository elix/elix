import * as symbols from './symbols.js';
import * as template from './template.js';
import Dialog from './Dialog.js';
import EffectMixin from './EffectMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';


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

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.backdropRole) {
      // Implicitly close on background clicks.
      this.$.backdrop.addEventListener('click', async () => {
        this[symbols.raiseChangeEvents] = true;
        await this.close();
        this[symbols.raiseChangeEvents] = false;
      });
    }
    if (changed.effect || changed.effectPhase || changed.enableEffects ||
        changed.fromEdge || changed.rightToLeft || changed.swipeFraction) {
      // Render the drawer.
      const {
        effect,
        effectPhase,
        enableEffects,
        fromEdge,
        rightToLeft,
        swipeFraction
      } = this.state;
      const opened = (effect === 'open' && effectPhase !== 'before') ||
        (effect === 'close' && effectPhase === 'before');

      const fromLeftEdge = fromEdge === 'left' ||
        fromEdge === 'start' && !rightToLeft ||
        fromEdge === 'end' && rightToLeft;

      const sign = fromLeftEdge ? -1 : 1;
      const swiping = swipeFraction !== null;
      // Constrain the distance swiped to between 0 and a bit less than 1. A swipe
      // distance of 1 itself would cause a tricky problem. The drawer would
      // render itself completely off screen. This means the expected CSS
      // transition would not occur, so the transitionend event wouldn't fire,
      // leaving us waiting indefinitely for an event that will never come. By
      // ensuring we always transition at least a tiny bit, we guarantee that a
      // transition and its accompanying event will occur.
      const constrainedSwipeFraction = swiping ?
        Math.max(Math.min(sign * swipeFraction, 0.999), 0) :
        0;
      const maxOpacity = 0.2;
      const opacity = opened ?
        maxOpacity * (1 - constrainedSwipeFraction) :
        0;

      const translateFraction = opened ?
      constrainedSwipeFraction :
        1;
      const translatePercentage = sign * translateFraction * 100;

      let duration = 0;
      const showTransition = enableEffects && !swiping &&
        effect && effectPhase === 'during';
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
      const transform = `translateX(${translatePercentage}%)`;

      Object.assign(this.$.backdrop.style, {
        opacity,
        'transition': showTransition ? `opacity ${duration}s linear` : undefined,
      });
      Object.assign(this.$.frame.style, {
        transform,
        'transition': showTransition ? `transform ${duration}s` : undefined,
      });
    }
    if (changed.fromEdge || changed.rightToLeft) {
      // Dock drawer to appropriate edge
      const { fromEdge, rightToLeft } = this.state;
      const mapFromEdgetoJustifyContent = {
        'end': 'flex-end',
        'left': rightToLeft ? 'flex-end' : 'flex-start',
        'right': rightToLeft ? 'flex-start' : 'flex-end',
        'start': 'flex-start'
      };
      this.style.justifyContent = mapFromEdgetoJustifyContent[fromEdge];
    }
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

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        :host {
          align-items: stretch;
          flex-direction: row;
        }

        #backdrop {
          will-change: opacity;
        }

        #frame {
          will-change: opacity;
        }
      </style>
    `);
  }

}


function drawerAppearsFromLeftEdge(element) {
  const fromEdge = element.fromEdge;
  const rightToLeft = element.state.rightToLeft;
  return fromEdge === 'left' ||
    fromEdge === 'start' && !rightToLeft ||
    fromEdge === 'end' && rightToLeft;
}


customElements.define('elix-drawer', Drawer);
export default Drawer;
