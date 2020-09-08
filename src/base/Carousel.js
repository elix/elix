import { forwardFocus } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import AriaListMixin from "./AriaListMixin.js";
import ArrowDirectionMixin from "./ArrowDirectionMixin.js";
import DirectionCursorMixin from "./DirectionCursorMixin.js";
import Explorer from "./Explorer.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  stateEffects,
  swipeTarget,
  template,
} from "./internal.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import SlidingStage from "./SlidingStage.js";
import SwipeDirectionMixin from "./SwipeDirectionMixin.js";
import TouchSwipeMixin from "./TouchSwipeMixin.js";
import TrackpadSwipeMixin from "./TrackpadSwipeMixin.js";

const Base = AriaListMixin(
  ArrowDirectionMixin(
    DirectionCursorMixin(
      FocusVisibleMixin(
        KeyboardDirectionMixin(
          KeyboardMixin(
            SwipeDirectionMixin(TouchSwipeMixin(TrackpadSwipeMixin(Explorer)))
          )
        )
      )
    )
  )
);

/**
 * Carousel with a sliding effect and navigation controls
 *
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. This component shows a small dot for each of its
 * items, and displays a sliding effect when moving between items.
 *
 * @inherits Explorer
 * @mixes AriaListMixin
 * @mixes ArrowDirectionMixin
 * @mixes DirectionCursorMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @part {SlidingStage} stage
 */
class Carousel extends Base {
  get [defaultState]() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // As of Mar 14 2018, Firefox does not yet support pointer queries, in which
    // case we assume use of a mouse.
    const pointerQuery = "(pointer: fine)";
    const mediaQueryList = window.matchMedia(pointerQuery);
    const showArrowButtons =
      mediaQueryList.media === pointerQuery ? mediaQueryList.matches : true;
    return Object.assign(super[defaultState], {
      orientation: "horizontal",
      proxyListOverlap: true,
      proxyListPosition: "bottom",
      showArrowButtons,
      stagePartType: SlidingStage,
    });
  }

  get orientation() {
    return this[state].orientation;
  }
  set orientation(orientation) {
    this[setState]({ orientation });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    if (changed.proxyListPartType && this[ids].proxyList) {
      // Turn off focus handling for old proxy list.
      const proxyList = this[ids].proxyList;
      if (proxyList instanceof HTMLElement) {
        forwardFocus(proxyList, null);
      }
    }

    super[render](changed);

    if (changed.stagePartType || changed.orientation) {
      /** @type {any} */ const cast = this[ids].stage;
      if ("orientation" in cast) {
        cast.orientation = this[state].orientation;
      }
    }

    if (changed.proxyListPartType) {
      // Keep focus off of the proxies and onto the carousel itself.
      const proxyList = this[ids].proxyList;
      if (proxyList instanceof HTMLElement) {
        forwardFocus(proxyList, this);
      }
      proxyList.removeAttribute("tabindex");
    }

    if (changed.orientation || changed.proxyListPartType) {
      /** @type {any} */ const cast = this[ids].proxyList;
      if ("orientation" in cast) {
        cast.orientation = this[state].orientation;
      }
    }

    if (changed.stagePartType) {
      this[ids].stage.removeAttribute("tabindex");
    }

    const proxies = this.proxies;
    if (changed.proxies && proxies) {
      // Make proxies not focusable.
      proxies.forEach((proxy) => {
        if (proxy instanceof HTMLElement) {
          proxy.tabIndex = -1;
        }
      });
    }
  }

  get [swipeTarget]() {
    const base = super[swipeTarget];
    const stage = this[ids].stage;
    return stage instanceof HTMLElement ? stage : base;
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When orientation changes, have swipe axis follow suit, and also
    // set the default proxy list position.
    if (changed.orientation) {
      const proxyListPosition =
        state.orientation === "horizontal" ? "bottom" : "right";
      Object.assign(effects, {
        proxyListPosition,
        swipeAxis: state.orientation,
      });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    const stage = result.content.querySelector("#stage");
    /** @type {any} */ const cast = this;
    cast[ArrowDirectionMixin.wrap](stage);

    const proxyList = result.content.getElementById("proxyList");
    if (proxyList) {
      proxyList.removeAttribute("tabindex");
    }

    result.content.append(
      fragmentFrom.html`
        <style>
          [part~=stage] {
            height: 100%;
            width: 100%;
          }
        </style>
      `
    );

    return result;
  }
}

export default Carousel;
