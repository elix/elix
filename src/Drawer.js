import * as symbols from './symbols.js';
import * as template from './template.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import ModalBackdrop from './ModalBackdrop.js';
import EffectMixin from './EffectMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';
import Overlay from './Overlay2.js';


const Base =
  DialogModalityMixin(
  EffectMixin(
  // FocusCaptureMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
  TransitionEffectMixin(
    Overlay
  )))))));


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
    const result = Object.assign(super.defaultState, {
      backdropRole: ModalBackdrop,
      fromEdge: 'start',
      gripSize: 0,
      selectedIndex: 0,
      tabIndex: -1
    });

    // Have swipeAxis follow fromEdge.
    result.onChange('fromEdge', state => {
      const { fromEdge } = state;
      const swipeAxis = fromEdge === 'top' || fromEdge === 'bottom' ?
        'vertical' :
        'horizontal';
      return {
        swipeAxis
      };
    });

    return result;
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

  get gripSize() {
    return this.state.gripSize;
  }
  set gripSize(gripSize) {
    this.setState({
      gripSize
    });
  }

  [symbols.render](/** @type {PlainObject} */ changed) {
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

      const fromLeadingEdge = fromEdge === 'left' ||
        fromEdge === 'top' ||
        fromEdge === 'start' && !rightToLeft ||
        fromEdge === 'end' && rightToLeft;

      // Constrain the distance swiped to between 0 and a bit less than 1. A swipe
      // distance of 1 itself would cause a tricky problem. The drawer would
      // render itself completely off screen. This means the expected CSS
      // transition would not occur, so the transitionend event wouldn't fire,
      // leaving us waiting indefinitely for an event that will never come. By
      // ensuring we always transition at least a tiny bit, we guarantee that a
      // transition and its accompanying event will occur.


      // Swipe bounds depend on whether drawer is current open or closed.
      const expectPositiveSwipe = (fromLeadingEdge && !opened) ||
        (!fromLeadingEdge && opened);
      const almost1 = 0.999;
      const lowerBound = expectPositiveSwipe ? 0 : -almost1;
      const upperBound = expectPositiveSwipe ? almost1 : 0;

      const swiping = swipeFraction !== null;
      const sign = fromLeadingEdge ? -1 : 1;
      let openedFraction = opened ? 1 : 0;
      if (swiping) {
        const boundedSwipeFraction =
          Math.max(Math.min(swipeFraction, upperBound), lowerBound);
        openedFraction -= sign * boundedSwipeFraction;
      }

      const maxOpacity = 0.2;
      const opacity = maxOpacity * openedFraction;

      const translateFraction = sign * (1 - openedFraction);
      const translatePercentage = translateFraction * 100;

      let duration = 0;
      // We don't show transitions during swiping, as it would give the swipe a
      // sluggish feel. We do show transitions during the open or close effect.
      // In the case where a user begins to close a drawer, but doesn't close it
      // more than halfway, we want to animate the transition back to the fully
      // opened state. For that, we show transitions during the "after" effect
      // phase.
      const showTransition = enableEffects && !swiping &&
        effect && (effectPhase === 'during' || effectPhase === 'after');
      if (showTransition) {
        // The time required to show transitions depends on how far apart the
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

      const vertical = fromEdge === 'top' || fromEdge === 'bottom';
      const axis = vertical ? 'Y' : 'X';
      const transform = `translate${axis}(${translatePercentage}%)`;

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

      // Stick drawer to all edges except the one opposite the fromEdge.
      const edgeCoordinates = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      };
      const mapFromEdgeToOppositeEdge = {
        bottom: 'top',
        left: 'right',
        right: 'left',
        top: 'bottom'
      };
      mapFromEdgeToOppositeEdge.start = mapFromEdgeToOppositeEdge[
        rightToLeft ? 'right' : 'left'
      ];
      mapFromEdgeToOppositeEdge.end = mapFromEdgeToOppositeEdge[
        rightToLeft ? 'left' : 'right'
      ];
      Object.assign(this.style, edgeCoordinates, {
        [mapFromEdgeToOppositeEdge[fromEdge]]: null
      });

      /** @type {IndexedObject<string>} */
      const mapFromEdgetoJustifyContent = {
        bottom: 'flex-end',
        end: 'flex-end',
        left: rightToLeft ? 'flex-end' : 'flex-start',
        right: rightToLeft ? 'flex-start' : 'flex-end',
        start: 'flex-start',
        top: 'flex-start'
      };

      this.style.flexDirection = fromEdge === 'top' || fromEdge === 'bottom' ?
        'column' :
        'row';
      this.style.justifyContent = mapFromEdgetoJustifyContent[fromEdge];
    }

    if (changed.opened) {
      // Only show backdrop when opened.
      const { opened } = this.state;
      this.$.backdrop.style.display = opened ? '' : 'none';
      this.style.pointerEvents = opened ? 'initial' : 'none';
    }
  }

  async [symbols.swipeDown]() {
    const { fromEdge } = this.state;
    if (fromEdge === 'top') {
      open(this);
    } else if (fromEdge === 'bottom') {
      close(this);
    }
  }

  async [symbols.swipeLeft]() {
    const { fromEdge, rightToLeft } = this.state;
    const fromLeftEdge = fromEdge === 'left' ||
      fromEdge === 'start' && !rightToLeft ||
      fromEdge === 'end' && rightToLeft;
    const fromRightEdge = fromEdge === 'right' ||
      fromEdge === 'start' && rightToLeft ||
      fromEdge === 'end' && !rightToLeft;
    if (fromRightEdge) {
      open(this);
    } else if (fromLeftEdge) {
      close(this);
    }
  }

  async [symbols.swipeRight]() {
    const { fromEdge, rightToLeft } = this.state;
    const fromLeftEdge = fromEdge === 'left' ||
      fromEdge === 'start' && !rightToLeft ||
      fromEdge === 'end' && rightToLeft;
    const fromRightEdge = fromEdge === 'right' ||
      fromEdge === 'start' && rightToLeft ||
      fromEdge === 'end' && !rightToLeft;
    if (fromLeftEdge) {
      open(this);
    } else if (fromRightEdge) {
      close(this);
    }
  }

  async [symbols.swipeUp]() {
    const { fromEdge } = this.state;
    if (fromEdge === 'bottom') {
      open(this);
    } else if (fromEdge === 'top') {
      close(this);
    }
  }

  get [symbols.swipeTarget]() {
    /** @type {any} */
    const element = this.$.frame;
    return element;
  }

  get [symbols.template]() {
    const result = super[symbols.template];
    // const frame = result.content.querySelector('#frame');
    // /** @type {any} */ const cast = this;
    // cast[FocusCaptureMixin.wrap](frame);
    return template.concat(result, template.html`
      <style>
        :host {
          align-items: stretch;
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


async function close(/** @type {Drawer} */ element) {
  element.setState({
    effect: 'close',
    effectPhase: 'during'
  });
  await element.close();  
}


async function open(/** @type {Drawer} */ element) {
  element.setState({
    effect: 'open',
    effectPhase: 'during'
  });
  await element.open();
}


customElements.define('elix-drawer', Drawer);
export default Drawer;
