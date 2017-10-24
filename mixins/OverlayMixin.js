import * as props from '../mixins/props.js';
import Symbol from '../mixins/Symbol.js';


const appendedToDocumentKey = Symbol('appendedToDocument');
const assignedZIndexKey = Symbol('assignedZIndex');
const previousFocusedElementKey = Symbol('previousFocusedElement');


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

    constructor() {
      super();
      this.addEventListener('blur', () => {
        // The focus was taken from us, perhaps because the focus was set
        // elsewhere, so we don't want to try to restore focus when closing.
        this[previousFocusedElementKey] = null;
      });
    }

    async close() {
      if (!this.closed) {
        await this.setState({
          visualState: this.visualStates.closed
        });
      }
    }

    get closed() {
      return this.state.visualState === this.visualStates.closed;
    }
    set closed(closed) {
      const parsed = String(closed) === 'true';
      const visualState = parsed ?
        this.visualStates.closed :
        this.visualStates.opened;
      this.setState({ visualState });
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      if (this.opened) {
        this.focus();
      }
    }

    componentDidUpdate() {
      if (super.componentDidUpdate) { super.componentDidUpdate(); }
      if (this.closed) {
        if (this[previousFocusedElementKey]) {
          this[previousFocusedElementKey].focus();
          this[previousFocusedElementKey] = null;
        }
        if (this[appendedToDocumentKey]) {
          // The overlay wasn't in the document when opened, so we added it.
          // Remove it now.
          this.parentNode.removeChild(this);
          this[appendedToDocumentKey] = false;
        }
      } else {
        if (!this[previousFocusedElementKey]) {
          this[previousFocusedElementKey] = document.activeElement;
        }
        this.focus();
      }
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        visualState: this.visualStates.closed
      });
    }

    hostProps(original) {
      const base = super.hostProps ? super.hostProps(original) : {};
      let zIndex;
      if (this.closed) {
        zIndex = original.style['z-index'];
        this[assignedZIndexKey] = null;
      } else {
        zIndex = original.style['z-index'] ||
          base.style && base.style['z-index'] ||
          this[assignedZIndexKey];
        if (!zIndex) {
          zIndex = maxZIndexInUse() + 1;
          // Remember that we assigned a z-index for this component.
          this[assignedZIndexKey] = zIndex;
        }
      }
      return props.merge(base, {
        attributes: {
          hidden: this.closed
        },
        style: {
          'z-index': zIndex
        }
      });
    }

    async open() {
      if (!this.opened) {
        if (!this.isConnected) {
          // Overlay isn't in document yet.
          this[appendedToDocumentKey] = true;
          document.body.appendChild(this);
        }
        await this.setState({
          visualState: this.visualStates.opened
        });
      }
    }

    get opened() {
      return this.state.visualState === this.visualStates.opened;
    }
    set opened(opened) {
      const parsed = String(opened) === 'true';
      const visualState = parsed ?
        this.visualStates.opened :
        this.visualStates.closed;
      this.setState({ visualState });
    }

    get visualStates() {
      // Defer to any definition in base class.
      if ('visualStates' in Base.prototype) { return super.visualStates; }
      // By default, provide opened and closed states.
      return {
        closed: 'closed',
        opened: 'opened'
      };
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
