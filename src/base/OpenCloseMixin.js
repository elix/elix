import { booleanAttributeValue } from "../core/AttributeMarshallingMixin.js";
import { setInternalState } from "../core/dom.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  startEffect,
  state,
  stateEffects,
} from "./internal.js";

/** @type {any} */
const closePromiseKey = Symbol("closePromise");
/** @type {any} */
const closeResolveKey = Symbol("closeResolve");

/**
 * Tracks the open/close state of a component.
 *
 * @module OpenCloseMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function OpenCloseMixin(Base) {
  // The class prototype added by the mixin.
  class OpenClose extends Base {
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "opened") {
        const value = booleanAttributeValue(name, newValue);
        if (this.opened !== value) {
          this.opened = value;
        }
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    /**
     * Close the component (if not already closed).
     *
     * Some components like [AlertDialog](AlertDialog) want to indicate why or
     * how they were closed. To support such scenarios, you can supply a value
     * to the optional `closeResult` parameter. This closeResult will be made
     * available in the `whenClosed` promise and the `state.closeResult` member.
     *
     * @param {object} [closeResult] - an indication of how or why the element closed
     */
    async close(closeResult) {
      if (super.close) {
        await super.close();
      }
      this[setState]({ closeResult });
      await this.toggle(false);
    }

    /**
     * True if the element is currently closed.
     *
     * This read-only property is provided as a convenient inverse of `opened`.
     *
     * @type {boolean}
     */
    get closed() {
      return this[state] && !this[state].opened;
    }

    /**
     * True if the element has completely closed.
     *
     * For components not using asynchronous open/close effects, this property
     * returns the same value as the `closed` property. For elements that have a
     * true value of `state.openCloseEffects` (e.g., elements using
     * [TransitionEffectMixin](TransitionEffectMixin)), this property returns
     * true only if `state.effect` is "close" and `state.effectPhase` is
     * "after".
     *
     * @type {boolean}
     */
    get closeFinished() {
      return this[state].closeFinished;
    }

    get closeResult() {
      return this[state].closeResult;
    }

    // @ts-ignore
    get [defaultState]() {
      const defaults = {
        closeResult: null,
        opened: false,
      };
      // If this component defines a `startEffect` method (e.g., by using
      // TransitionEffectMixin), include default state for open/close effects.
      // Since the component is closed by default, the default effect state is
      // after the close effect has completed.
      if (this[startEffect]) {
        Object.assign(defaults, {
          closeFinished: true,
          effect: "close",
          effectPhase: "after",
          openCloseEffects: true,
        });
      }
      return Object.assign(super[defaultState] || {}, defaults);
    }

    /**
     * Open the element (if not already opened).
     */
    async open() {
      if (super.open) {
        await super.open();
      }
      this[setState]({ closeResult: undefined });
      await this.toggle(true);
    }

    /**
     * True if the element is currently opened.
     *
     * This property can be set as a boolean attribute
     *
     * @type {boolean}
     * @default false
     */
    get opened() {
      return this[state] && this[state].opened;
    }
    set opened(opened) {
      this[setState]({ closeResult: undefined });
      this.toggle(opened);
    }

    [render](changed) {
      super[render](changed);

      // Reflect opened state.
      if (changed.opened) {
        const { opened } = this[state];
        setInternalState(this, "opened", opened);
      }

      // Reflect closed state. To handle asynchronous close effects, we reflect
      // the inverse of closeFinished instead of reflecting closed.
      if (changed.closeFinished) {
        const { closeFinished } = this[state];
        setInternalState(this, "closed", closeFinished);
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (changed.opened && this[raiseChangeEvents]) {
        const oldEvent = new CustomEvent("opened-changed", {
          bubbles: true,
          detail: {
            closeResult: this[state].closeResult,
            opened: this[state].opened,
          },
        });
        this.dispatchEvent(oldEvent);
        /**
         * Raised when the opened/closed state of the component changes.
         *
         * @event openedchange
         */
        const openedChangeEvent = new CustomEvent("openedchange", {
          bubbles: true,
          detail: {
            closeResult: this[state].closeResult,
            opened: this[state].opened,
          },
        });
        this.dispatchEvent(openedChangeEvent);

        if (this[state].opened) {
          const oldOpenedEvent = new CustomEvent("opened", {
            bubbles: true,
          });
          this.dispatchEvent(oldOpenedEvent);
          /**
           * Raised when the component opens.
           *
           * @event open
           */
          const openEvent = new CustomEvent("open", {
            bubbles: true,
          });
          this.dispatchEvent(openEvent);
        } else {
          const oldClosedEvent = new CustomEvent("closed", {
            bubbles: true,
            detail: {
              closeResult: this[state].closeResult,
            },
          });
          this.dispatchEvent(oldClosedEvent);
          /**
           * Raised when the component closes.
           *
           * @event close
           */
          const closeEvent = new CustomEvent("close", {
            bubbles: true,
            detail: {
              closeResult: this[state].closeResult,
            },
          });
          this.dispatchEvent(closeEvent);
        }
      }

      // If someone's waiting for the component to close, and it's completely
      // finished closing, then resolve the close promise.
      const closeResolve = this[closeResolveKey];
      if (this.closeFinished && closeResolve) {
        this[closeResolveKey] = null;
        this[closePromiseKey] = null;
        closeResolve(this[state].closeResult);
      }
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
        : {};

      // Update our notion of closeFinished to track the closed state for
      // components with synchronous open/close effects and components with
      // asynchronous open/close effects.
      if (
        changed.openCloseEffects ||
        changed.effect ||
        changed.effectPhase ||
        changed.opened
      ) {
        const { effect, effectPhase, openCloseEffects, opened } = state;
        const closeFinished = openCloseEffects
          ? effect === "close" && effectPhase === "after"
          : !opened;
        Object.assign(effects, { closeFinished });
      }

      return effects;
    }

    /**
     * Toggle the open/close state of the element.
     *
     * @param {boolean} [opened] - true if the element should be opened, false
     * if closed.
     */
    async toggle(opened = !this.opened) {
      if (super.toggle) {
        await super.toggle(opened);
      }
      const changed = opened !== this[state].opened;
      if (changed) {
        /** @type {PlainObject} */ const changes = { opened };
        if (this[state].openCloseEffects) {
          changes.effect = opened ? "open" : "close";
          if (this[state].effectPhase === "after") {
            changes.effectPhase = "before";
          }
        }
        await this[setState](changes);
      }
    }

    /**
     * This method can be used as an alternative to listening to the
     * "openedchange" event, particularly in situations where you want to only
     * handle the next time the component is closed.
     *
     * @returns {Promise} A promise that resolves when the element has
     * completely closed, including the completion of any asynchronous opening
     * effect.
     */
    whenClosed() {
      if (!this[closePromiseKey]) {
        this[closePromiseKey] = new Promise((resolve) => {
          this[closeResolveKey] = resolve;
        });
      }
      return this[closePromiseKey];
    }
  }

  return OpenClose;
}
