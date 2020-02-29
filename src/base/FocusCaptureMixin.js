import { firstFocusableElement } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

// Symbols for private data members on an element.
const wrap = Symbol("wrap");
/** @type {any} */
const wrappingFocusKey = Symbol("wrappingFocus");

/**
 * Allows Tab and Shift+Tab operations to cycle the focus within the component.
 *
 * This mixin expects the component to provide:
 *
 * * A template-stamping mechanism compatible with `ShadowTemplateMixin`.
 *
 * The mixin provides these features to the component:
 *
 * * Template elements and event handlers that will cause the keyboard focus to wrap.
 *
 * This mixin [contributes to a component's template](mixins#mixins-that-contribute-to-a-component-s-template).
 * See that discussion for details on how to use such a mixin.
 *
 * @module FocusCaptureMixin
 * @param {Constructor<ReactiveElement>} Base
 */
function FocusCaptureMixin(Base) {
  class FocusCapture extends Base {
    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }
      this[internal.ids].focusCatcher.addEventListener("focus", () => {
        if (!this[wrappingFocusKey]) {
          // Wrap focus back to the first focusable element.
          const focusElement = firstFocusableElement(this[internal.shadowRoot]);
          if (focusElement) {
            focusElement.focus();
          }
        }
      });
    }

    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      const firstElement = firstFocusableElement(this[internal.shadowRoot]);
      const onFirstElement =
        document.activeElement === firstElement ||
        this[internal.shadowRoot].activeElement === firstElement;
      if (onFirstElement && event.key === "Tab" && event.shiftKey) {
        // Set focus to focus catcher.
        // The Shift+Tab keydown event should continue bubbling, and the default
        // behavior should cause it to end up on the last focusable element.
        this[wrappingFocusKey] = true;
        this[internal.ids].focusCatcher.focus();
        this[wrappingFocusKey] = false;
        // Don't mark the event as handled, since we want it to keep bubbling up.
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        (super[internal.keydown] && super[internal.keydown](event)) || false
      );
    }

    /**
     * Destructively wrap a node with elements necessary to capture focus.
     *
     * Call this method in a components `internal.template` property.
     * Invoke this method as `this[FocusCaptureMixin.wrap](element)`.
     *
     * @param {Node} original - the element within which focus should wrap
     */
    [wrap](original) {
      const focusCaptureTemplate = template.html`
        <style>
          #focusCapture {
            display: flex;
            height: 100%;
            overflow: hidden;
            width: 100%;
          }

          #focusCaptureContainer {
            align-items: center;
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            position: relative;
          }
        </style>
        <div id="focusCapture">
          <div id="focusCaptureContainer"></div>
          <div id="focusCatcher" tabindex="0"></div>
        </div>
      `;
      template.wrap(
        original,
        focusCaptureTemplate.content,
        "#focusCaptureContainer"
      );
    }
  }

  return FocusCapture;
}

FocusCaptureMixin.wrap = wrap;

export default FocusCaptureMixin;
