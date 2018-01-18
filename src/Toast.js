import { merge } from './updates.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import OverlayMixin from './OverlayMixin.js';
import PopupModalityMixin from './PopupModalityMixin.js';
import symbols from './symbols.js';


const timeoutKey = Symbol('timeout');


const Base =
  KeyboardMixin(
  LanguageDirectionMixin(
  OpenCloseMixin(
  OverlayMixin(
  PopupModalityMixin(
  TransitionEffectMixin(
    ElementBase
  ))))));


/**
 * A lightweight popup intended to display a short, non-critical message until a
 * specified `duration` elapses or the user dismisses it.
 * 
 * @inherits ElementBase
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes PopupModalityMixin
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
    if (super.componentDidMount) { await super.componentDidMount(); }
    startTimerIfOpened(this);
  }

  async componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { await super.componentDidUpdate(previousState); }
    startTimerIfOpened(this);
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
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
    return [this.$.content];
  }

  get fromEdge() {
    return this.state.fromEdge;
  }
  set fromEdge(fromEdge) {
    this.setState({ fromEdge });
  }

  get updates() {
    const base = super.updates || {};

    // Host
    const hostEdgeStyles = {
      'bottom': {
        'align-items': 'center',
        'justify-content': 'flex-end',
      },
      'bottom-left': {
        'align-items': 'flex-start',
        'justify-content': 'flex-end',
      },
      'bottom-right': {
        'align-items': 'flex-end',
        'justify-content': 'flex-end',
      },
      'top': {
        'align-items': 'center',
        'justify-content': null
      },
      'top-left': {
        'align-items': 'flex-start',
        'justify-content': null
      },
      'top-right': {
        'align-items': 'flex-end',
        'justify-content': null
      }
    };
    const hostEdgeStyle = hostEdgeStyles[this.state.fromEdge];
    const display = base.style && base.style.display || 'flex';

    // Content
    const oppositeEdge = {
      'bottom-left': 'bottom-right',
      'bottom-right': 'bottom-left',
      'top-left': 'top-right',
      'top-right': 'top-left'
    };
    const fromEdge = this.state.fromEdge;
    const languageAdjustedEdge = this.rightToLeft ?
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

    const effect = this.state.effect;
    const phase = this.state.effectPhase;
    const opened = (effect === 'open' && phase !== 'before') ||
      (effect === 'close' && phase === 'before');

    const opacity = opened ? 1 : 0;
    const transform = opened ?
      openEdgeTransforms[languageAdjustedEdge] :
      edgeTransforms[languageAdjustedEdge];

    const contentProps = {
      style: {
        opacity,
        transform
      }
    };
    
    return merge(base, {
      style: {
        'align-items': hostEdgeStyle['align-items'],
        display,
        'justify-content': hostEdgeStyle['justify-content'],
      },
      $: {
        content: contentProps
      }
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          flex-direction: column;
          height: 100%;
          left: 0;
          outline: none;
          pointer-events: none;
          position: fixed;
          top: 0;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }

        #content {
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
      <div id="content">
        <slot></slot>
      </div>
    `;
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
