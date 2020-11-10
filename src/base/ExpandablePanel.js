import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import EffectMixin from "./EffectMixin.js";
import {
  defaultState,
  effectEndTarget,
  ids,
  render,
  setState,
  state,
  template,
} from "./internal.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import TransitionEffectMixin from "./TransitionEffectMixin.js";

const Base = OpenCloseMixin(
  EffectMixin(TransitionEffectMixin(ReactiveElement))
);

/**
 * Region that expands/collapses in place with an animated transition
 *
 * [A region that can be expanded and collapsed](/demos/expandablePanel.html)
 *
 * This component combines [OpenCloseMixin](OpenCloseMixin),
 * [TransitionEffectMixin](TransitionEffectMixin) and a simple CSS height
 * animation.
 *
 * This component handles only the duties of collapsing and expanding. It does
 * not provide a user interface for the user to trigger the change in state;
 * you must provide that user interface yourself.
 *
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 * @mixes EffectMixin
 * @mixes TransitionEffectMixin
 */
class ExpandablePanel extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      transitionDuration: 250,
    });
  }

  // @ts-ignore
  get [effectEndTarget]() {
    return this[ids].outerContainer;
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.effect || changed.effectPhase || changed.enableEffects) {
      const { effect, effectPhase, enableEffects, transitionDuration } = this[
        state
      ];

      // The inner container lets us measure how tall the content wants to be.
      const naturalHeight = this[ids].innerContainer.getBoundingClientRect()
        .height;

      // The effect phase (before, during, after) determines which height we apply
      // to the outer container.
      /** @type {IndexedObject<PlainObject>} */
      const phaseHeights = {
        open: {
          before: "0px",
          during: `${naturalHeight}px`,
          after: "",
        },
        close: {
          before: `${naturalHeight}px`,
          during: "0px",
          after: "0px",
        },
      };
      const height = phaseHeights[effect][effectPhase];

      // This animates an element's height, which may not produce the smoothest
      // results. See
      // https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse.
      // Animating height does have the advantage of letting you set the height of
      // the panel's collapsed state by setting the panel's `min-height`.
      const durationInSeconds = transitionDuration / 1000;
      const transition =
        enableEffects && effectPhase === "during"
          ? `height ${durationInSeconds}s`
          : null;

      Object.assign(this[ids].outerContainer.style, {
        height,
        transition,
      });
    }
    if (changed.opened || changed.tabIndex) {
      // We only set aria-expanded if this component can get the keyboard focus
      // (which it usually won't).
      const canReceiveFocus = this[state].tabIndex >= 0;
      if (canReceiveFocus) {
        this.toggleAttribute("aria-expanded", this[state].opened);
      } else {
        this.removeAttribute("aria-expanded");
      }
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: block;
          overflow: hidden;
        }
      </style>
      <div id="outerContainer" role="none">
        <div id="innerContainer" role="none">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /**
   * The duration of the expand/collapse transition in milliseconds.
   *
   * @type {number}
   * @default {250}
   */
  get transitionDuration() {
    return this[state].transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    if (!isNaN(transitionDuration)) {
      this[setState]({ transitionDuration });
    }
  }
}

export default ExpandablePanel;
