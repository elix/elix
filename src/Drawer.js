import * as internal from './internal.js';
import * as template from './template.js';
import DialogModalityMixin from './DialogModalityMixin.js';
import EffectMixin from './EffectMixin.js';
import FocusCaptureMixin from './FocusCaptureMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import ModalBackdrop from '../src/ModalBackdrop.js';
import Overlay from './Overlay.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';

const Base = DialogModalityMixin(
  EffectMixin(
    FocusCaptureMixin(
      KeyboardMixin(
        LanguageDirectionMixin(
          TouchSwipeMixin(TrackpadSwipeMixin(TransitionEffectMixin(Overlay)))
        )
      )
    )
  )
);

/**
 * A panel that slides in from the side of the page
 *
 * A drawer is often used to provide navigation in situations where: a) screen
 * real estate is constrained and b) the navigation UI is not critical to
 * completing the user’s primary goal (and, hence, not critical to the
 * application’s business goal).
 *
 * @inherits Overlay
 * @mixes DialogModalityMixin
 * @mixes EffectMixin
 * @mixes FocusCaptureMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @mixes TransitionEffectMixin
 */
class Drawer extends Base {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();

    // If user clicks on frame while drawer is closed (implying that gripSize is
    // greater than zero), then open the drawer.
    this[internal.ids].frame.addEventListener('click', event => {
      this[internal.raiseChangeEvents] = true;
      if (this.closed) {
        this.open();
        event.stopPropagation();
      }
      this[internal.raiseChangeEvents] = false;
    });

    // Reflect opened attribute.
    this.setAttribute('opened', this[internal.state].opened.toString());
  }

  [internal.componentDidUpdate](/** @typeof {PlainObject} */ changed) {
    if (super[internal.componentDidUpdate]) {
      super[internal.componentDidUpdate](changed);
    }
    if (changed.opened) {
      // Reflect opened attribute.
      this.setAttribute('opened', this[internal.state].opened.toString());
    }
  }

  get [internal.defaultState]() {
    const result = Object.assign(super[internal.defaultState], {
      backdropPartType: ModalBackdrop,
      fromEdge: 'start',
      gripSize: null,
      persistent: true,
      role: 'landmark',
      selectedIndex: 0,
      tabIndex: -1
    });

    // Have swipeAxis follow fromEdge.
    result.onChange('fromEdge', state => {
      const { fromEdge } = state;
      const swipeAxis =
        fromEdge === 'top' || fromEdge === 'bottom' ? 'vertical' : 'horizontal';
      return {
        swipeAxis
      };
    });

    return result;
  }

  get [internal.effectEndTarget]() {
    // As long as both the frame and the overlay complete their transition
    // at the same time, we can use either one to signal the completion of
    // the effect.
    return this[internal.ids].frame;
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
    return this[internal.state].fromEdge;
  }
  set fromEdge(fromEdge) {
    this[internal.setState]({ fromEdge });
  }

  get gripSize() {
    return this[internal.state].gripSize;
  }
  set gripSize(gripSize) {
    this[internal.setState]({ gripSize });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);

    if (changed.backdropPartType) {
      // Implicitly close on background clicks.
      this[internal.ids].backdrop.addEventListener('click', async () => {
        this[internal.raiseChangeEvents] = true;
        await this.close();
        this[internal.raiseChangeEvents] = false;
      });
    }

    if (changed.gripSize || changed.opened || changed.swipeFraction) {
      const { gripSize, opened, swipeFraction } = this[internal.state];
      const swiping = swipeFraction !== null;
      const openedOrSwiping = opened || swiping;

      // Only listen to pointer events if opened or swiping.
      this.style.pointerEvents = openedOrSwiping ? 'initial' : 'none';

      // Clip frame to its bounding box when drawer is completely closed. This
      // prevents any box-shadow on the frame from being visible.
      const hasGrip = gripSize !== null;
      const clip = !hasGrip && !openedOrSwiping;
      this[internal.ids].frame.style.clipPath = clip ? 'inset(0px)' : '';
    }

    if (
      changed.effect ||
      changed.effectPhase ||
      changed.enableEffects ||
      changed.fromEdge ||
      changed.gripSize ||
      changed.rightToLeft ||
      changed.swipeFraction
    ) {
      // Render the drawer.
      const {
        effect,
        effectPhase,
        enableEffects,
        fromEdge,
        gripSize,
        rightToLeft,
        swipeFraction
      } = this[internal.state];
      const opened =
        (effect === 'open' && effectPhase !== 'before') ||
        (effect === 'close' && effectPhase === 'before');

      const fromLeadingEdge =
        fromEdge === 'left' ||
        fromEdge === 'top' ||
        (fromEdge === 'start' && !rightToLeft) ||
        (fromEdge === 'end' && rightToLeft);

      // Constrain the distance swiped to between 0 and a bit less than 1. A swipe
      // distance of 1 itself would cause a tricky problem. The drawer would
      // render itself completely off screen. This means the expected CSS
      // transition would not occur, so the transitionend event wouldn't fire,
      // leaving us waiting indefinitely for an event that will never come. By
      // ensuring we always transition at least a tiny bit, we guarantee that a
      // transition and its accompanying event will occur.

      // Swipe bounds depend on whether drawer is current open or closed.
      const expectPositiveSwipe =
        (fromLeadingEdge && !opened) || (!fromLeadingEdge && opened);
      const almost1 = 0.999;
      const lowerBound = expectPositiveSwipe ? 0 : -almost1;
      const upperBound = expectPositiveSwipe ? almost1 : 0;

      const swiping = swipeFraction !== null;
      const sign = fromLeadingEdge ? -1 : 1;
      let openedFraction = opened ? 1 : 0;
      if (swiping) {
        const boundedSwipeFraction = Math.max(
          Math.min(swipeFraction, upperBound),
          lowerBound
        );
        openedFraction -= sign * boundedSwipeFraction;
      }

      const maxOpacity = 0.2;
      const opacity = maxOpacity * openedFraction;

      const translateFraction = sign * (1 - openedFraction);

      if (swiping || (effect === 'open' && effectPhase === 'before')) {
        // Beginning open effect or swiping; show backdrop.
        this[internal.ids].backdrop.style.visibility = 'visible';
      } else if (effect === 'close' && effectPhase === 'after') {
        // Finished close effect; hide backdrop.
        this[internal.ids].backdrop.style.visibility = 'hidden';
      }

      let duration = 0;

      // We don't show transitions during swiping, as it would give the swipe a
      // sluggish feel. We do show transitions during the open or close effect.
      // In the case where a user begins to close a drawer, but doesn't close it
      // more than halfway, we want to animate the transition back to the fully
      // opened state. For that, we show transitions during the "after" effect
      // phase.
      const showTransition =
        enableEffects &&
        !swiping &&
        effect &&
        (effectPhase === 'during' || effectPhase === 'after');
      if (showTransition) {
        // The time required to show transitions depends on how far apart the
        // elements currently are from their desired state. As a reference point,
        // we compare the expected opacity of the backdrop to its current opacity.
        // (We can't use the swipeFraction, because no swipe is in progress.)
        /** @type {any} */
        const backdrop = this[internal.ids].backdrop;
        const opacityCurrent = parseFloat(backdrop.style.opacity) || 0;
        const opacityRemaining = Math.abs(opacityCurrent - opacity);
        const fullDuration = 0.25; // Quarter second
        duration = (opacityRemaining / maxOpacity) * fullDuration;
      }

      const vertical = fromEdge === 'top' || fromEdge === 'bottom';
      const axis = vertical ? 'Y' : 'X';
      const translatePercentage = `${translateFraction * 100}%`;
      const gripValue = gripSize ? gripSize * -sign * (1 - openedFraction) : 0;
      const translateValue =
        gripValue === 0
          ? translatePercentage
          : `calc(${translatePercentage} + ${gripValue}px)`;
      const transform = `translate${axis}(${translateValue})`;

      Object.assign(this[internal.ids].backdrop.style, {
        opacity,
        transition: showTransition ? `opacity ${duration}s linear` : undefined
      });
      Object.assign(this[internal.ids].frame.style, {
        transform,
        transition: showTransition ? `transform ${duration}s` : undefined
      });
    }

    if (changed.fromEdge || changed.rightToLeft) {
      // Dock drawer to appropriate edge
      const { fromEdge, rightToLeft } = this[internal.state];

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
      mapFromEdgeToOppositeEdge.start =
        mapFromEdgeToOppositeEdge[rightToLeft ? 'right' : 'left'];
      mapFromEdgeToOppositeEdge.end =
        mapFromEdgeToOppositeEdge[rightToLeft ? 'left' : 'right'];
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

      this.style.flexDirection =
        fromEdge === 'top' || fromEdge === 'bottom' ? 'column' : 'row';
      this.style.justifyContent = mapFromEdgetoJustifyContent[fromEdge];
    }

    if (changed.opened) {
      // Reflect opened state to ARIA attribute.
      this.setAttribute(
        'aria-expanded',
        this[internal.state].opened.toString()
      );
    }
  }

  async [internal.swipeDown]() {
    const { fromEdge } = this[internal.state];
    if (fromEdge === 'top') {
      open(this);
    } else if (fromEdge === 'bottom') {
      close(this);
    }
  }

  async [internal.swipeLeft]() {
    const { fromEdge, rightToLeft } = this[internal.state];
    const fromLeftEdge =
      fromEdge === 'left' ||
      (fromEdge === 'start' && !rightToLeft) ||
      (fromEdge === 'end' && rightToLeft);
    const fromRightEdge =
      fromEdge === 'right' ||
      (fromEdge === 'start' && rightToLeft) ||
      (fromEdge === 'end' && !rightToLeft);
    if (fromRightEdge) {
      open(this);
    } else if (fromLeftEdge) {
      close(this);
    }
  }

  async [internal.swipeRight]() {
    const { fromEdge, rightToLeft } = this[internal.state];
    const fromLeftEdge =
      fromEdge === 'left' ||
      (fromEdge === 'start' && !rightToLeft) ||
      (fromEdge === 'end' && rightToLeft);
    const fromRightEdge =
      fromEdge === 'right' ||
      (fromEdge === 'start' && rightToLeft) ||
      (fromEdge === 'end' && !rightToLeft);
    if (fromLeftEdge) {
      open(this);
    } else if (fromRightEdge) {
      close(this);
    }
  }

  async [internal.swipeUp]() {
    const { fromEdge } = this[internal.state];
    if (fromEdge === 'bottom') {
      open(this);
    } else if (fromEdge === 'top') {
      close(this);
    }
  }

  // Tell TrackpadSwipeMixin that the frame is the scrollable element the user
  // is going to try to scroll with the trackpad.
  get [internal.scrollTarget]() {
    return this[internal.ids].frame;
  }

  get [internal.swipeTarget]() {
    return /** @type {any} */ (this[internal.ids].frame);
  }

  get [internal.template]() {
    const result = super[internal.template];
    const frameContent = result.content.querySelector('#frameContent');
    /** @type {any} */ const cast = this;
    cast[FocusCaptureMixin.wrap](frameContent);
    return template.concat(
      result,
      template.html`
        <style>
          :host {
            align-items: stretch;
            -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          }

          #backdrop {
            will-change: opacity;
          }

          #frame {
            overflow: auto;
            will-change: transform;
          }
          :host([opened="false"]) #frame {
            overflow: hidden;
          }
        </style>
      `
    );
  }
}

async function close(/** @type {Drawer} */ element) {
  element[internal.setState]({
    effect: 'close',
    effectPhase: 'during'
  });
  await element.close();
}

async function open(/** @type {Drawer} */ element) {
  element[internal.setState]({
    effect: 'open',
    effectPhase: 'during'
  });
  await element.open();
}

export default Drawer;
