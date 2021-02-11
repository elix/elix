import { setInternalState } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import DialogModalityMixin from "./DialogModalityMixin.js";
import EffectMixin from "./EffectMixin.js";
import FocusCaptureMixin from "./FocusCaptureMixin.js";
import {
  defaultState,
  effectEndTarget,
  ids,
  raiseChangeEvents,
  render,
  rendered,
  scrollTarget,
  setState,
  state,
  stateEffects,
  swipeDown,
  swipeLeft,
  swipeRight,
  swipeTarget,
  swipeUp,
  template,
} from "./internal.js";
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
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      backdropPartType: ModalBackdrop,
      drawerTransitionDuration: 250, // milliseconds
      fromEdge: "start",
      gripSize: null,
      openedFraction: 0,
      openedRenderedFraction: 0,
      persistent: true,
      role: "landmark",
      showTransition: false,
      tabIndex: -1,
    });
  }

  // @ts-ignore
  get [effectEndTarget]() {
    // As long as both the frame and the overlay complete their transition
    // at the same time, we can use either one to signal the completion of
    // the effect.
    return this[ids].frame;
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
    return this[state].fromEdge;
  }
  set fromEdge(fromEdge) {
    this[setState]({ fromEdge });
  }

  get gripSize() {
    return this[state].gripSize;
  }
  set gripSize(gripSize) {
    this[setState]({ gripSize });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (changed.backdropPartType) {
      // Implicitly close on background clicks.
      this[ids].backdrop.addEventListener("click", async () => {
        this[raiseChangeEvents] = true;
        await this.close();
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.gripSize || changed.opened || changed.swipeFraction) {
      const { gripSize, opened, swipeFraction } = this[state];
      const swiping = swipeFraction !== null;
      const openedOrSwiping = opened || swiping;

      // Only listen to pointer events if opened or swiping.
      this.style.pointerEvents = openedOrSwiping ? "initial" : "none";

      // Clip frame to its bounding box when drawer is completely closed. This
      // prevents any box-shadow on the frame from being visible.
      const hasGrip = gripSize !== null;
      const clip = !hasGrip && !openedOrSwiping;
      this[ids].frame.style.clipPath = clip ? "inset(0px)" : "";
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
        swipeFraction,
      } = this[state];

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
        this[ids].backdrop.style.visibility = "visible";
      } else if (effect === "close" && effectPhase === "after") {
        // Finished close effect; hide backdrop.
        this[ids].backdrop.style.visibility = "hidden";
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

      Object.assign(this[ids].frame.style, {
        transform,
        transition: showTransition ? `transform ${duration}s` : "",
      });
    }

    // Dock drawer to appropriate edge
    if (changed.fromEdge || changed.rightToLeft) {
      const { fromEdge, rightToLeft } = this[state];

      // Stick drawer to all edges except the one opposite the fromEdge.
      const edgeCoordinates = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      };
      const mapFromEdgeToOppositeEdge = {
        bottom: "top",
        left: "right",
        right: "left",
        top: "bottom",
      };
      mapFromEdgeToOppositeEdge.start =
        mapFromEdgeToOppositeEdge[rightToLeft ? "right" : "left"];
      mapFromEdgeToOppositeEdge.end =
        mapFromEdgeToOppositeEdge[rightToLeft ? "left" : "right"];
      Object.assign(this.style, edgeCoordinates, {
        [mapFromEdgeToOppositeEdge[fromEdge]]: null,
      });

      /** @type {IndexedObject<string>} */
      const mapFromEdgetoJustifyContent = {
        bottom: "flex-end",
        end: "flex-end",
        left: rightToLeft ? "flex-end" : "flex-start",
        right: rightToLeft ? "flex-start" : "flex-end",
        start: "flex-start",
        top: "flex-start",
      };

      this.style.flexDirection =
        fromEdge === "top" || fromEdge === "bottom" ? "column" : "row";
      this.style.justifyContent = mapFromEdgetoJustifyContent[fromEdge];
    }

    // Reflect opened state to ARIA attribute.
    if (changed.opened) {
      this.setAttribute("aria-expanded", this[state].opened.toString());
    }
  }

  [rendered](/** @type {ChangedFlags} */ changed) {
    super[rendered](changed);

    if (changed.opened) {
      // Reflect opened attribute.
      setInternalState(this, "opened", this[state].opened);
    }

    if (changed.openedFraction) {
      // Remember that we've rendered the drawer at this opened fraction.
      this[setState]({
        openedRenderedFraction: this[state].openedFraction,
      });
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
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
        swipeFraction,
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

  async [swipeDown]() {
    const { fromEdge } = this[state];
    if (fromEdge === "top") {
      open(this);
    } else if (fromEdge === "bottom") {
      close(this);
    }
  }

  async [swipeLeft]() {
    const { fromEdge, rightToLeft } = this[state];
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

  async [swipeRight]() {
    const { fromEdge, rightToLeft } = this[state];
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

  async [swipeUp]() {
    const { fromEdge } = this[state];
    if (fromEdge === "bottom") {
      open(this);
    } else if (fromEdge === "top") {
      close(this);
    }
  }

  // Tell TrackpadSwipeMixin that the frame is the scrollable element the user
  // is going to try to scroll with the trackpad.
  get [scrollTarget]() {
    return this[ids].frame;
  }

  // @ts-ignore
  get [swipeTarget]() {
    return /** @type {any} */ (this[ids].frame);
  }

  get [template]() {
    const result = super[template];

    // Wrap default slot with another container that traps focus.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <div id="frameContent">
          <slot></slot>
        </div>
      `);
      const frameContent = result.content.querySelector("#frameContent");
      /** @type {any} */ const cast = this;
      cast[FocusCaptureMixin.wrap](frameContent);
    }

    // We'd prefer to use inline-grid instead of inline-flex; see Dialog.js
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            align-items: stretch;
            display: inline-flex;
            flex-direction: column;
            -webkit-overflow-scrolling: touch; /* for momentum scrolling */
          }

          #frameContent {
            display: block;
            max-height: 100%;
            max-width: 100%;
            overflow: hidden;
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
  element[setState]({
    effect: "close",
    effectPhase: "during",
  });
  await element.close();
}

async function open(/** @type {Drawer} */ element) {
  element[setState]({
    effect: "open",
    effectPhase: "during",
  });
  await element.open();
}

export default Drawer;
