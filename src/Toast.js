import * as symbols from './symbols.js';
import * as template from './template.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import Popup from './Popup.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';


const timeoutKey = Symbol('timeout');


const Base =
  LanguageDirectionMixin(
  TransitionEffectMixin(
    Popup
  ));


/**
 * Lightweight popup intended to display a short, non-critical message
 * 
 * The message remains until  the user dismisses it or a specified `duration`
 * elapses.
 * 
 * @inherits Popup
 * @mixes LanguageDirectionMixin
 * @mixes TransitionEffectMixin
 */
class Toast extends Base {

  constructor() {
    super();
    this.addEventListener('mouseout', () => {
      startTimerIfOpened(this);
    });
    this.addEventListener('mouseover', () => {
      clearTimer(this);
    });
  }

  async componentDidMount() {
    await super.componentDidMount();
    startTimerIfOpened(this);
  }

  async componentDidUpdate(changed) {
    await super.componentDidUpdate(changed);
    startTimerIfOpened(this);
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      duration: null,
      fromEdge: 'bottom',
    });
  }

  get duration() {
    return this.state.duration;
  }
  set duration(duration) {
    this.setState({ duration });
  }

  get [symbols.elementsWithTransitions]() {
    return [this.$.frame];
  }

  /**
   * The edge of the viewport from which the toast will appear.
   * 
   * The `start` and `end` values refer to text direction: in left-to-right
   * languages such as English, these are equivalent to `left` and `right`,
   * respectively.
   * 
   * @type {('bottom'|'end'|'left'|'right'|'start'|'top')}
   * @default 'bottom'
   */
  get fromEdge() {
    return this.state.fromEdge;
  }
  set fromEdge(fromEdge) {
    this.setState({ fromEdge });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.fromEdge) {
      // Host
      const hostEdgeStyles = {
        'bottom': {
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        'bottom-left': {
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        },
        'bottom-right': {
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        },
        'top': {
          alignItems: 'center',
          justifyContent: null
        },
        'top-left': {
          alignItems: 'flex-start',
          justifyContent: null
        },
        'top-right': {
          alignItems: 'flex-end',
          justifyContent: null
        }
      };
      Object.assign(this.style, hostEdgeStyles[this.state.fromEdge]);
    }
    if (changed.effect || changed.effectPhase || changed.fromEdge
        || changed.rightToLeft) {
      const { effect, effectPhase, fromEdge, rightToLeft } = this.state;
      const oppositeEdge = {
        'bottom-left': 'bottom-right',
        'bottom-right': 'bottom-left',
        'top-left': 'top-right',
        'top-right': 'top-left'
      };
      const languageAdjustedEdge = rightToLeft ?
        (oppositeEdge[fromEdge] || fromEdge) :
        fromEdge;
  
      const edgeTransforms = {
        'bottom': 'translateY(100%)',
        'bottom-left': 'translateX(-100%)',
        'bottom-right': 'translateX(100%)',
        'top': 'translateY(-100%)',
        'top-left': 'translateX(-100%)',
        'top-right': 'translateX(100%)'
      };
      const openEdgeTransforms = {
        'bottom': 'translateY(0)',
        'bottom-left': 'translateX(0)',
        'bottom-right': 'translateX(0)',
        'top': 'translateY(0)',
        'top-left': 'translateX(0)',
        'top-right': 'translateX(0)'
      };
  
      const opened = (effect === 'open' && effectPhase !== 'before') ||
        (effect === 'close' && effectPhase === 'before');
  
      const opacity = opened ? 1 : 0;
      const transform = opened ?
        openEdgeTransforms[languageAdjustedEdge] :
        edgeTransforms[languageAdjustedEdge];
  
      Object.assign(this.$.frame.style, {
        opacity,
        transform
      });
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        :host {
          align-items: initial;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: initial;
          left: 0;
          outline: none;
          pointer-events: none;
          position: fixed;
          top: 0;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }

        #frame {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          margin: 1em;
          pointer-events: initial;
          position: relative;
          transition-duration: 0.25s;
          transition-property: opacity, transform;
          will-change: opacity, transform;
        }
      </style>
    `);
  }

}


function clearTimer(element) {
  if (element[timeoutKey]) {
    clearTimeout(element[timeoutKey]);
    element[timeoutKey] = null;
  }
}

function startTimer(element) {
  clearTimer(element);
  const duration = element.state.duration;
  if (duration !== null && duration > 0) {
    element[timeoutKey] = setTimeout(() => {
      element.close();
    }, duration);
  }
}

function startTimerIfOpened(element) {
  if (element.opened) {
    startTimer(element);
  }
}


customElements.define('elix-toast', Toast);
export default Toast;
