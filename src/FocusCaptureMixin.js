import Symbol from './Symbol.js';
import symbols from './symbols.js';


// Symbols for private data members on an element.
const wrappingFocusKey = Symbol('wrappingFocus');


/**
 * This mixin wraps a component’s template such that, once the component gains
 * the keyboard focus, Tab and Shift+Tab operations will cycle the focus within
 * the component.
 * 
 * This mixin expects the component to provide:
 * 
 * * A template-stamping mechanism compatible with `ShadowTemplateMixin`.
 * 
 * The mixin provides these features to the component:
 * 
 * * Template elements and event handlers that will cause the keyboard focus to wrap.
 *
 * @module FocusCaptureMixin
 */
export default function FocusCaptureMixin(base) {

  class FocusCapture extends base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.$.focusCatcher.addEventListener('focus', () => {
        if (!this[wrappingFocusKey]) {
          // Wrap focus back to the dialog.
          this.focus();
        }
      });
    }

    [symbols.keydown](event) {
      /** @type {any} */
      const element = this;
      if (document.activeElement === element &&
          this.shadowRoot.activeElement === null &&
          event.keyCode === 9 && event.shiftKey) {
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

    wrapWithFocusCapture(template) {
      return `
        ${template}
        <div id="focusCatcher" tabindex="0"></div>
      `;
    }

  }

  return FocusCapture;
}
