import { setInternalState } from "../core/dom.js";
import * as internal from "./internal.js";
import DialogModalityMixin from "./DialogModalityMixin.js";
import EffectMixin from "./EffectMixin.js";
import FocusCaptureMixin from "./FocusCaptureMixin.js";
import html from "../core/html.js";
import KeyboardMixin from "./KeyboardMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ModalBackdrop from "./ModalBackdrop.js";
import Overlay from "./Overlay.js";
import TouchSwipeMixin from "./TouchSwipeMixin.js";
import TrackpadSwipeMixin from "./TrackpadSwipeMixin.js";
import TransitionEffectMixin from "./TransitionEffectMixin.js";

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
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: ModalBackdrop,
      drawerTransitionDuration: 250, // milliseconds
      fromEdge: "start",
      gripSize: null,
      openedFraction: 0,
      openedRenderedFraction: 0,
      persistent: true,
      role: "landmark",
      selectedIndex: 0,
      showTransition: false,
      tabIndex: -1
    });
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

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);

    if (changed.backdropPartType) {
      // Implicitly close on background clicks.
      this[internal.ids].backdrop.addEventListener("click", async () => {
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
      this.style.pointerEvents = openedOrSwiping ? "initial" : "none";

      // Clip frame to its bounding box when drawer is completely closed. This
      // prevents any box-shadow on the frame from being visible.
      const hasGrip = gripSize !== null;
      const clip = !hasGrip && !openedOrSwiping;
      this[internal.ids].frame.style.clipPath = clip ? "inset(0px)" : "";
    }

    // As the drawer opens (closes), slide the frame all the way out (in).
    if (
      changed.effect ||
      changed.effectPhase ||
      changed.fromEdge ||
      changed.gripSize ||
      changed.openedFraction ||
      changed.rightToLeft ||
      changed.swipeFraction
    ) {
      const {
        drawerTransitionDuration,
        effect,
        effectPhase,
        fromEdge,
        gripSize,
        openedFraction,
        openedRenderedFraction,
        rightToLeft,
        showTransition,
        swipeFraction
      } = this[internal.state];

      const fromLeadingEdge =
        fromEdge === "left" ||
        fromEdge === "top" ||
        (fromEdge === "start" && !rightToLeft) ||
        (fromEdge === "end" && rightToLeft);

      const swiping = swipeFraction !== null;
      const sign = fromLeadingEdge ? -1 : 1;

      const translateFraction = sign * (1 - openedFraction);

      if (swiping || (effect === "open" && effectPhase === "before")) {
        // Beginning open effect or swiping; show backdrop.
        this[internal.ids].backdrop.style.visibility = "visible";
      } else if (effect === "close" && effectPhase === "after") {
        // Finished close effect; hide backdrop.
        this[internal.ids].backdrop.style.visibility = "hidden";
      }

      // The time required to show transitions depends on how far apart the
      // elements currently are from their desired state.
      const transitionFraction = Math.abs(
        openedFraction - openedRenderedFraction
      );

      const duration = showTransition
        ? transitionFraction * (drawerTransitionDuration / 1000)
        : 0;

      const vertical = fromEdge === "top" || fromEdge === "bottom";
      const axis = vertical ? "Y" : "X";
      const translatePercentage = `${translateFraction * 100}%`;
      const gripValue = gripSize ? gripSize * -sign * (1 - openedFraction) : 0;
      const translateValue =
        gripValue === 0
          ? translatePercentage
          : `calc(${translatePercentage} + ${gripValue}px)`;
      const transform = `translate${axis}(${translateValue})`;

      Object.assign(this[internal.ids].frame.style, {
        transform,
        transition: showTransition ? `transform ${duration}s` : ""
      });
    }

    // Dock drawer to appropriate edge
    if (changed.fromEdge || changed.rightToLeft) {
      const { fromEdge, rightToLeft } = this[internal.state];

      // Stick drawer to all edges except the one opposite the fromEdge.
      const edgeCoordinates = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      };
      const mapFromEdgeToOppositeEdge = {
        bottom: "top",
        left: "right",
        right: "left",
        top: "bottom"
      };
      mapFromEdgeToOppositeEdge.start =
        mapFromEdgeToOppositeEdge[rightToLeft ? "right" : "left"];
      mapFromEdgeToOppositeEdge.end =
        mapFromEdgeToOppositeEdge[rightToLeft ? "left" : "right"];
      Object.assign(this.style, edgeCoordinates, {
        [mapFromEdgeToOppositeEdge[fromEdge]]: null
      });

      /** @type {IndexedObject<string>} */
      const mapFromEdgetoJustifyContent = {
        bottom: "flex-end",
        end: "flex-end",
        left: rightToLeft ? "flex-end" : "flex-start",
        right: rightToLeft ? "flex-start" : "flex-end",
        start: "flex-start",
        top: "flex-start"
      };

      this.style.flexDirection =
        fromEdge === "top" || fromEdge === "bottom" ? "column" : "row";
      this.style.justifyContent = mapFromEdgetoJustifyContent[fromEdge];
    }

    // Reflect opened state to ARIA attribute.
    if (changed.opened) {
      this.setAttribute(
        "aria-expanded",
        this[internal.state].opened.toString()
      );
    }
  }

  [internal.rendered](/** @type {ChangedFlags} */ changed) {
    super[internal.rendered](changed);

    if (changed.opened) {
      // Reflect opened attribute.
      setInternalState(this, "opened", this[internal.state].opened);
    }

    if (changed.openedFraction) {
      // Remember that we've rendered the drawer at this opened fraction.
      this[internal.setState]({
        openedRenderedFraction: this[internal.state].openedFraction
      });
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects]
      ? super[internal.stateEffects](state, changed)
      : {};

    // Have swipeAxis follow fromEdge.
    if (changed.fromEdge) {
      const { fromEdge } = state;
      const swipeAxis =
        fromEdge === "top" || fromEdge === "bottom" ? "vertical" : "horizontal";
      Object.assign(effects, { swipeAxis });
    }

    // During a swipe or open/close, update openedFraction state.
    if (
      changed.effect ||
      changed.effectPhase ||
      changed.fromEdge ||
      changed.rightToLeft ||
      changed.swipeFraction
    ) {
      const {
        effect,
        effectPhase,
        fromEdge,
        rightToLeft,
        swipeFraction
      } = state;
      const opened =
        (effect === "open" && effectPhase !== "before") ||
        (effect === "close" && effectPhase === "before");

      const fromLeadingEdge =
        fromEdge === "left" ||
        fromEdge === "top" ||
        (fromEdge === "start" && !rightToLeft) ||
        (fromEdge === "end" && rightToLeft);

      // Constrain the opened fraction to between 0 and a bit less than 1. A
      // swipe distance of 1 itself would cause a tricky problem. The drawer
      // would render itself completely off screen. This means the expected CSS
      // transition would not occur, so the transitionend event wouldn't fire,
      // leaving us waiting indefinitely for an event that will never come. By
      // ensuring we always transition at least a tiny bit, we guarantee that a
      // transition and its accompanying event will occur.
      const almost1 = 0.999;

      // Swipe bounds depend on whether drawer is current open or closed.
      const expectPositiveSwipe =
        (fromLeadingEdge && !opened) || (!fromLeadingEdge && opened);
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
      Object.assign(effects, { openedFraction });
    }

    // Don't show transitions during swiping, as it would give the swipe a
    // sluggish feel. We do show transitions during the open or close effect. In
    // the case where a user begins to close a drawer, but doesn't close it more
    // than halfway, we want to animate the transition back to the fully opened
    // state. For that, we show transitions during the "after" effect phase.
    if (
      changed.enableEffects ||
      changed.effect ||
      changed.effectPhase ||
      changed.swipeFraction
    ) {
      const { enableEffects, effect, effectPhase, swipeFraction } = state;
      const swiping = swipeFraction !== null;
      const showTransition =
        enableEffects &&
        !swiping &&
        effect &&
        (effectPhase === "during" || effectPhase === "after");
      Object.assign(effects, { showTransition });
    }

    return effects;
  }

  async [internal.swipeDown]() {
    const { fromEdge } = this[internal.state];
    if (fromEdge === "top") {
      open(this);
    } else if (fromEdge === "bottom") {
      close(this);
    }
  }

  async [internal.swipeLeft]() {
    const { fromEdge, rightToLeft } = this[internal.state];
    const fromLeftEdge =
      fromEdge === "left" ||
      (fromEdge === "start" && !rightToLeft) ||
      (fromEdge === "end" && rightToLeft);
    const fromRightEdge =
      fromEdge === "right" ||
      (fromEdge === "start" && rightToLeft) ||
      (fromEdge === "end" && !rightToLeft);
    if (fromRightEdge) {
      open(this);
    } else if (fromLeftEdge) {
      close(this);
    }
  }

  async [internal.swipeRight]() {
    const { fromEdge, rightToLeft } = this[internal.state];
    const fromLeftEdge =
      fromEdge === "left" ||
      (fromEdge === "start" && !rightToLeft) ||
      (fromEdge === "end" && rightToLeft);
    const fromRightEdge =
      fromEdge === "right" ||
      (fromEdge === "start" && rightToLeft) ||
      (fromEdge === "end" && !rightToLeft);
    if (fromLeftEdge) {
      open(this);
    } else if (fromRightEdge) {
      close(this);
    }
  }

  async [internal.swipeUp]() {
    const { fromEdge } = this[internal.state];
    if (fromEdge === "bottom") {
      open(this);
    } else if (fromEdge === "top") {
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

    const frameContent = result.content.querySelector("#frameContent");
    /** @type {any} */ const cast = this;
    cast[FocusCaptureMixin.wrap](frameContent);

    result.content.append(
      html`
        <style>
          :host {
            align-items: stretch;
            -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          }

          [part~="backdrop"] {
            will-change: opacity;
          }

          [part~="frame"] {
            overflow: auto;
            will-change: transform;
          }

          :host([opened="false"]) [part~="frame"] {
            overflow: hidden;
          }
        </style>
      `
    );

    return result;
  }
}

async function close(/** @type {Drawer} */ element) {
  element[internal.setState]({
    effect: "close",
    effectPhase: "during"
  });
  await element.close();
}

async function open(/** @type {Drawer} */ element) {
  element[internal.setState]({
    effect: "open",
    effectPhase: "during"
  });
  await element.open();
}

export default Drawer;
