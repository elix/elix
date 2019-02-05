import { firstFocusableElement } from './utilities.js';
import * as symbols from './symbols.js';
import * as template from './template.js';


// Symbols for private data members on an element.
const wrap = Symbol('wrap');
/** @type {any} */
const wrappingFocusKey = Symbol('wrappingFocus');


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
 */
function FocusCaptureMixin(base) {

  class FocusCapture extends base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.focusCatcher.addEventListener('focus', () => {
        if (!this[wrappingFocusKey]) {
          // Wrap focus back to the first focusable element.
          const focusElement = firstFocusableElement(this.shadowRoot);
          if (focusElement) {
            focusElement.focus();
          }
        }
      });
    }

    [symbols.keydown](event) {
      const firstElement = firstFocusableElement(this.shadowRoot);
      const onFirstElement = document.activeElement === firstElement ||
        this.shadowRoot.activeElement === firstElement;
      if (onFirstElement && event.key === 'Tab' && event.shiftKey) {
        // Set focus to focus catcher.
        // The Shift+Tab keydown event should continue bubbling, and the default
        // behavior should cause it to end up on the last focusable element.
        this[wrappingFocusKey] = true;
        this.$.focusCatcher.focus();
        this[wrappingFocusKey] = false;
        // Don't mark the event as handled, since we want it to keep bubbling up.
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (super[symbols.keydown] && super[symbols.keydown](event)) || false;
    }

    /**
     * Destructively wrap a node with elements necessary to capture focus.
     * 
     * Call this method in a components `symbols.template` property.
     * Invoke this method as `this[FocusCaptureMixin.wrap](element)`.
     * 
     * @param {Node} original - the element within which focus should wrap
     */
    [wrap](original) {
      const focusCaptureTemplate = template.html`
        <div style="display: flex;">
          <div id="focusCaptureContainer" style="display: flex;"></div>
          <div id="focusCatcher" tabindex="0"></div>
        </div>
      `;
      template.wrap(original, focusCaptureTemplate.content, '#focusCaptureContainer');
    }

  }

  return FocusCapture;
}


FocusCaptureMixin.wrap = wrap;


export default FocusCaptureMixin;
