import { forwardFocus } from "../core/dom.js";
import * as internal from "./internal.js";
import AriaListMixin from "./AriaListMixin.js";
import ArrowDirectionMixin from "./ArrowDirectionMixin.js";
import DarkModeMixin from "./DarkModeMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import Explorer from "./Explorer.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import html from "../core/html.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import SlidingStage from "./SlidingStage.js";
import SwipeDirectionMixin from "./SwipeDirectionMixin.js";
import TouchSwipeMixin from "./TouchSwipeMixin.js";
import TrackpadSwipeMixin from "./TrackpadSwipeMixin.js";

const Base = AriaListMixin(
  ArrowDirectionMixin(
    DarkModeMixin(
      DirectionSelectionMixin(
        FocusVisibleMixin(
          KeyboardDirectionMixin(
            KeyboardMixin(
              SwipeDirectionMixin(TouchSwipeMixin(TrackpadSwipeMixin(Explorer)))
            )
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
 * @mixes DarkModeMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @part {SlidingStage} stage
 */
class Carousel extends Base {
  get [internal.defaultState]() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // As of Mar 14 2018, Firefox does not yet support pointer queries, in which
    // case we assume use of a mouse.
    const pointerQuery = "(pointer: fine)";
    const mediaQueryList = window.matchMedia(pointerQuery);
    const showArrowButtons =
      mediaQueryList.media === pointerQuery ? mediaQueryList.matches : true;
    return Object.assign(super[internal.defaultState], {
      orientation: "horizontal",
      proxyListOverlap: true,
      proxyListPosition: "bottom",
      showArrowButtons,
      stagePartType: SlidingStage
    });
  }

  get orientation() {
    return this[internal.state].orientation;
  }
  set orientation(orientation) {
    this[internal.setState]({ orientation });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    if (changed.proxyListPartType && this[internal.ids].proxyList) {
      // Turn off focus handling for old proxy list.
      const proxyList = this[internal.ids].proxyList;
      if (proxyList instanceof HTMLElement) {
        forwardFocus(proxyList, null);
      }
    }

    super[internal.render](changed);

    if (changed.stagePartType || changed.orientation) {
      /** @type {any} */ const cast = this[internal.ids].stage;
      if ("orientation" in cast) {
        cast.orientation = this[internal.state].orientation;
      }
    }

    if (changed.proxyListPartType) {
      // Keep focus off of the proxies and onto the carousel itself.
      const proxyList = this[internal.ids].proxyList;
      if (proxyList instanceof HTMLElement) {
        forwardFocus(proxyList, this);
      }
      proxyList.removeAttribute("tabindex");
    }

    if (changed.orientation || changed.proxyListPartType) {
      /** @type {any} */ const cast = this[internal.ids].proxyList;
      if ("orientation" in cast) {
        cast.orientation = this[internal.state].orientation;
      }
    }

    if (changed.stagePartType) {
      this[internal.ids].stage.removeAttribute("tabindex");
    }

    const { darkMode } = this[internal.state];
    const proxies = this.proxies;
    // Wait for knowledge of dark mode
    if ((changed.darkMode || changed.proxies) && darkMode !== null && proxies) {
      // Apply dark mode to proxies.
      proxies.forEach(proxy => {
        /** @type {any} */ const cast = proxy;
        if ("darkMode" in cast) {
          cast.darkMode = darkMode;
        }
      });
    }

    if (changed.proxies && proxies) {
      // Make proxies not focusable.
      proxies.forEach(proxy => {
        if (proxy instanceof HTMLElement) {
          proxy.tabIndex = -1;
        }
      });
    }
  }

  get [internal.swipeTarget]() {
    const base = super[internal.swipeTarget];
    const stage = this[internal.ids].stage;
    return stage instanceof HTMLElement ? stage : base;
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // When orientation changes, have swipe axis follow suit, and also
    // set the default proxy list position.
    if (changed.orientation) {
      const proxyListPosition =
        state.orientation === "horizontal" ? "bottom" : "right";
      Object.assign(effects, {
        proxyListPosition,
        swipeAxis: state.orientation
      });
    }

    return effects;
  }

  get [internal.template]() {
    const result = super[internal.template];

    const stage = result.content.querySelector("#stage");
    /** @type {any} */ const cast = this;
    cast[ArrowDirectionMixin.wrap](stage);

    const proxyList = result.content.getElementById("proxyList");
    if (proxyList) {
      proxyList.setAttribute("tabindex", "");
    }

    result.content.append(
      html`
        <style>
          [part~="stage"] {
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
