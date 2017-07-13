import symbols from '../mixins/symbols.js';


/**
 * This mixin wraps a component’s template to add a backdrop element suitable
 * for use in modal overlays such as dialogs. The backdrop plays two roles: the
 * it prevents background clicks, and it can be styled (with, for example, a
 * semi-transparent background color) to help focus the user’s attention away
 * from the page background and toward the overlay. This wrapper is often used
 * in conjunction with `DialogModalityMixin`.
 * 
 * This wrapper expects the component to provide:
 * 
 * * A template-stamping mechanism compatible with `ShadowTemplateMixin`.
 * 
 * The wrapper provides these features to the component:
 * 
 * * A container element identified as `#overlayContent` that holds the
 *   element’s primary content.
 * * A backdrop element identified as `#backdrop` that sits behind the primary
 *   content and covers the viewport.
 * 
 * By default, `BackdropWrapper` provides no styling of the backdrop. If you are
 * using this wrapper in your component, the elements added by the wrapper will
 * be in your component’s shadow tree, so you can style them like any shadow
 * element.
 *
 * @module BackdropWrapper
 */
export default function BackdropWrapper(base) {

  // The class prototype added by the mixin.
  class Backdrop extends base {

    get backdrop() {
      return this.shadowRoot.querySelector('#backdrop');
    }

    [symbols.template](filler) {
      const template = `
        <style>
          :host {
            height: 100%;
            left: 0;
            outline: none;
            position: fixed;
            top: 0;
            -webkit-tap-highlight-color: transparent;
            width: 100%;
          }

          #backdrop {
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            user-select: none;
            width: 100%;
          }

          #overlayContent {
            position: relative;
          }
        </style>
        <div id="backdrop" role="none"></div>
        <div id="overlayContent" role="none">
          ${filler || `<slot></slot>`}
        </div>
      `;
      return super[symbols.template] ?
        super[symbols.template](template) :
        template;
    }
  }

  return Backdrop;
}
