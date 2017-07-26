import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';
import TransitionEffectMixin from '../mixins/TransitionEffectMixin.js';


const durationKey = Symbol('duration');
const fromEdgeKey = Symbol('fromEdge');
const timeoutKey = Symbol('timeout');


const Base =
  AttributeMarshallingMixin(
  OpenCloseMixin(
  OverlayMixin(
  ShadowTemplateMixin(
  TransitionEffectMixin(
    HTMLElement
  )))));


/**
 * A lightweight popup intended to display a short, non-critical message until a
 * specified `duration` elapses or the user dismisses it.
 * 
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes ShadowTemplateMixin
 * @mixes TransitionEffectMixin
 */
class Toast extends Base {

  constructor() {
    super();

    // If the user moves the mouse over the element, stop the timer.
    this.addEventListener('mouseover', () => {
      clearTimer(this);
    });

    // If the user moves the mouse away, restart the timer.
    this.addEventListener('mouseout', () => {
      startTimer(this);
    });

    // Set defaults.
    if (typeof this.duration === 'undefined') {
      this.duration = this[symbols.defaults].duration;
    }
    if (typeof this.fromEdge === 'undefined') {
      this.fromEdge = this[symbols.defaults].fromEdge;
    }
  }

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }
    
    // Set default ARIA role for the popup.
    if (this.getAttribute('role') == null && this[symbols.defaults].role) {
      this.setAttribute('role', this[symbols.defaults].role);
    }

    // We can't seem to write a CSS rule that lets a shadow element be sensitive
    // to the `dir` attribute of an ancestor, so we reflect the inherited
    // direction to the component. We can then write styles that key off of
    // that.
    const direction = getComputedStyle(this).direction;
    if (direction === 'rtl' && !this.dir) {
      this.setAttribute('dir', 'rtl');
    }
  }

  [symbols.afterEffect](effect) {
    if (super[symbols.afterEffect]) { super[symbols.afterEffect](effect); }
    switch (effect) {
      case 'opening':
        startTimer(this);
        break;
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.duration = 2500; /* milliseconds */
    defaults.fromEdge = 'bottom';
    defaults.role = 'alert';
    return defaults;
  }

  /**
   * This property specifies in milliseconds how long a toast should remain open
   * before being implicitly closed. The default value is 2500 milliseconds (2.5
   * seconds).
   * 
   * To support interactivity within a toast, the timer is disabled if the user
   * moves the mouse inside the toast or taps within it. When/if the user later
   * moves the mouse outside the toast, or taps outside it, the timer will be
   * restarted at zero.
   * 
   * Setting `duration` to `null` will disable the timer, allowing the toast to
   * remain open indefinitely.
   * 
   * @type {number}
   * @default 2500
   */
  get duration() {
    return this[durationKey];
  }
  /**
   * @param {number} duration - The duration to show the toast, in milliseconds
   */
  set duration(duration) {
    this[durationKey] = typeof duration === 'string' ? parseInt(duration) : duration;
  }

  [symbols.elementsWithTransitions](effect) {
    return [this.shadowRoot.querySelector('#overlayContent')];
  }

  /**
   * The `fromEdge` property determines the edge from which the toast will slide
   * into view. Supported values are:
   * 
   * * "bottom" (the default): slides in from the center of the bottom of the
   *   window.
   * * "bottom-left"
   * * "bottom-right"
   * * "top"
   * * "top-left"
   * * "top-right"
   * 
   * The `Toast` component supports right-to-left languages such as Arabic and
   * Hebrew. If the effective value of the element’s `dir` attribute is set to
   * "rtl" (right to left), then the interpretation of the `fromEdge` property
   * will be flipped horizontally: for example, setting `from-edge=“top-right”`
   * will cause the `Toast` to appear from the top _left_.
   *
   * @type {"bottom"|"bottom-left"|"bottom-right"|"top"|"top-left"|"top-right"|null}
   */
  get fromEdge() {
    return this[fromEdgeKey];
  }
  set fromEdge(fromEdge) {
    this[fromEdgeKey] = fromEdge;
    this.reflectAttribute('from-edge', fromEdge);
  }

  [symbols.openedChanged](opened) {
    if (!opened) {
      clearTimer(this);
    }
  }

  [symbols.template](filler) {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          left: 0;
          outline: none;
          pointer-events: none;
          position: fixed;
          top: 0;
          width: 100%;
        }

        :host(:not(.visible)) {
          display: none;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          margin: 1em;
          opacity: 0;
          pointer-events: initial;
          will-change: opacity, transform;
        }

        :host(.opened:not(.effect)) #overlayContent,
        :host(.effect.opening) #overlayContent {
          opacity: 1.0;
        }

        :host(.effect) #overlayContent {
          transition-duration: 0.25s;
          transition-property: opacity, transform;
        }
        :host(.effect.opening) #overlayContent {
          transition-timing-function: ease-out;
        }
        :host(.effect.closing) #overlayContent {
          transition-timing-function: ease-in;
        }

        /* From bottom edge (the default) */
        :host([from-edge="bottom"]) {
          align-items: center;
          justify-content: flex-end;
        }
        :host([from-edge="bottom"]) #overlayContent {
          transform: translateY(100%);
        }
        :host([from-edge="bottom"].opened:not(.effect)) #overlayContent,
        :host([from-edge="bottom"].effect.opening) #overlayContent {
          transform: translateY(0);
        }

        /* From bottom-left corner */
        :host([from-edge="bottom-left"]) {
          align-items: flex-start;
          justify-content: flex-end;
        }
        :host([from-edge="bottom-left"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="bottom-left"][dir="rtl"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="bottom-left"].opened:not(.effect)) #overlayContent,
        :host([from-edge="bottom-left"].effect.opening) #overlayContent {
          transform: translateX(0);
        }

        /* From bottom-right corner */
        :host([from-edge="bottom-right"]) {
          align-items: flex-end;
          justify-content: flex-end;
        }
        :host([from-edge="bottom-right"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="bottom-right"][dir="rtl"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="bottom-right"].opened:not(.effect)) #overlayContent,
        :host([from-edge="bottom-right"].effect.opening) #overlayContent {
          transform: translateX(0);
        }

        /* From top edge */
        :host([from-edge="top"]) {
          align-items: center;
        }
        :host([from-edge="top"]) #overlayContent {
          transform: translateY(-100%);
        }
        :host([from-edge="top"].opened:not(.effect)) #overlayContent,
        :host([from-edge="top"].effect.opening) #overlayContent {
          transform: translateY(0);
        }

        /* From top-left corner */
        :host([from-edge="top-left"]) {
          align-items: flex-start;
        }
        :host([from-edge="top-left"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="top-left"][dir="rtl"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="top-left"].opened:not(.effect)) #overlayContent,
        :host([from-edge="top-left"].effect.opening) #overlayContent {
          transform: translateX(0);
        }

        /* From top-right corner */
        :host([from-edge="top-right"]) {
          align-items: flex-end;
        }
        :host([from-edge="top-right"]) #overlayContent {
          transform: translateX(100%);
        }
        :host([from-edge="top-right"][dir="rtl"]) #overlayContent {
          transform: translateX(-100%);
        }
        :host([from-edge="top-right"].opened:not(.effect)) #overlayContent,
        :host([from-edge="top-right"].effect.opening) #overlayContent {
          transform: translateX(0);
        }
      </style>
      <div id="overlayContent">
        ${filler || `<slot></slot>`}
      </div>
    `;
  }

}


customElements.define('elix-toast', Toast);
export default Toast;


function clearTimer(element) {
  if (element[timeoutKey]) {
    clearTimeout(element[timeoutKey]);
    element[timeoutKey] = null;
  }
}

function startTimer(element) {
  clearTimer(element);
  const duration = element.duration;
  if (duration != null && duration > 0) {
    element[timeoutKey] = setTimeout(() => {
      element[symbols.raiseChangeEvents] = true;
      element.close();
      element[symbols.raiseChangeEvents] = false;
    }, duration);
  }
}
