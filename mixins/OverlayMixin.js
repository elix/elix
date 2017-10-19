import * as props from '../mixins/props.js';


/**
 * This mixin makes an opened element appear on top of other page elements, then
 * hide or remove it when closed. This mixin and `OpenCloseMixin` form the core
 * overlay behavior for Elix components.
 * 
 * The mixin expects the component to provide:
 * 
 * * An invocation of `symbols.beforeEffect` and `symbols.afterEffect` methods
 *   for both "opening" and “closing” effects. This is generally implemented by
 *   using `OpenCloseMixin`.
 * 
 * The mixin provides these features to the component:
 * 
 * 1. Appends the element to the DOM when opened, if it’s not already in the
 *    DOM.
 * 2. Can calculate and apply a default z-index that in many cases will be
 *    sufficient to have the overlay appear on top of other page elements.
 * 3. Makes the element visible before any opening effects begin, and hides it
 *    after any closing effects complete.
 * 4. Remembers which element had the focus before the overlay was opened, and
 *    tries to restore the focus there when the overlay is closed.
 * 5. A `teleportToBodyOnOpen` property that optionally moves an element already
 *    in the DOM to the end of the document body when opened. This is intended
 *    only to address challenging overlay edge cases; see the discussion below.
 * 
 * If the component defines the following optional members, the mixin will take
 * advantage of them:
 * 
 * * An effect API compatible with `TransitionEffectMixin`. This allows an
 *   element to provide opening/closing effects. The effects are _not_ applied
 *   if the `opened` property is set in markup when the document is loading. The
 *   use of transition effects is not required. It is not necessary for a
 *   component to use `TransitionEffectMixin` or a compatible mixin. In that
 *   case, `OverlayMixin` will simply perform its work synchronously.
 * 
 * All other aspects of overlay behavior are handled by other mixins and
 * wrappers. For example, addition of a backdrop element behind the overlay is
 * handled by `BackdropWrapper`. Intercepting and responding to UI events is
 * handled by `PopupModalityMixin` and `DialogModalityMixin`. Management of
 * asynchronous visual opening/closing effects are provided by
 * `TransitionEffectMixin`.
 * 
 * @module OverlayMixin
 */
export default function OverlayMixin(Base) {

  // The class prototype added by the mixin.
  class Overlay extends Base {

    close() {
      this.setState({
        visualState: 'closed'
      });
    }

    get closed() {
      return this.state.visualState === 'closed';
    }

    // componentDidMount() {
    //   if (super.componentDidMount) { super.componentDidMount(); }
    //   updateStyle(this);
    // }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }
      updateStyle(this);
      // this.addEventListener('blur', () => {
      //   // The focus was taken from us, perhaps because the focus was set
      //   // elsewhere, so we don't want to try to restore focus when closing.
      //   this[previousFocusedElementKey] = null;
      // });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        visualState: 'closed'
      });
    }

    hostProps(original) {
      const base = super.hostProps ? super.hostProps(original) : {};
      return props.merge(base, {
        attributes: {
          hidden: this.closed
        },
      });
    }

    open() {
      this.setState({
        visualState: 'opened'
      });
    }
  }

  return Overlay;
}


/*
 * Return the highest z-index currently in use in the document's light DOM.
 * 
 * This calculation looks at all light DOM elements, so is theoretically
 * expensive. That said, it only runs when an overlay is opening, and is only used
 * if an overlay doesn't have a z-index already. In cases where performance is
 * an issue, this calculation can be completely circumvented by manually
 * applying a z-index to an overlay.
 */
function maxZIndexInUse() {
  const elements = document.body.querySelectorAll('*');
  const zIndices = Array.prototype.map.call(elements, element => {
    const style = getComputedStyle(element);
    let zIndex = 0;
    if (style.position !== 'static' && style.zIndex !== 'auto') {
      const parsed = style.zIndex ? parseInt(style.zIndex) : 0;
      zIndex = !isNaN(parsed) ? parsed : 0;
    }
    return zIndex;
  });
  return Math.max(...zIndices);
}


function updateStyle(element) {
  if (element.closed) {
    // Remove previously assigned z-index.
    element.style.zIndex = null;

    // TODO: Restore focus to previously-focused element.
  } else {
    // See if the element already has a z-index assigned via CSS. If no z-index
    // is found, we'll calculate and apply a default z-index.
    const style = getComputedStyle(element);
    const computedZIndex = style.zIndex;
    // Note that Safari returns a default zIndex of "0" for elements
    // with position: fixed, while Blink returns "auto".
    if (computedZIndex === 'auto' ||
      (style.position === 'fixed' && computedZIndex === '0')) {
      // Assign default z-index.
      element.style.zIndex = maxZIndexInUse() + 1;
    }

    // Give the overlay focus.
    element.focus();
  }
}
