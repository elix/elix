import * as props from '../mixins/props.js';
import ElementBase from './ElementBase.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseTransitionMixin from '../mixins/OpenCloseTransitionMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import PopupModalityMixin from '../mixins/PopupModalityMixin.js';
import symbols from '../mixins/symbols.js';


const timeoutKey = Symbol('timeout');


const Base =
  KeyboardMixin(
  OpenCloseTransitionMixin(
  OverlayMixin(
  PopupModalityMixin(
    ElementBase
  ))));


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
    this.addEventListener('mouseout', () => {
      startTimerIfOpened(this);
    });
    this.addEventListener('mouseover', () => {
      clearTimer(this);
    });
  }

  async close() {
    await this.startClose();
  }

  async componentDidMount() {
    if (super.componentDidMount) { await super.componentDidMount(); }
    startTimerIfOpened(this);
  }

  async componentDidUpdate() {
    if (super.componentDidUpdate) { await super.componentDidUpdate(); }
    startTimerIfOpened(this);
  }

  get contentProps() {
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

    const opacity = this.opened ? 1 : 0;
    const transform = this.opened ?
      openEdgeTransforms[languageAdjustedEdge] :
      edgeTransforms[languageAdjustedEdge];

    return {
      style: {
        'background': 'white',
        'border': '1px solid rgba(0, 0, 0, 0.2)',
        'boxShadow': '0 2px 10px rgba(0, 0, 0, 0.5)',
        'margin': '1em',
        opacity,
        'pointerEvents': 'initial',
        'position': 'relative',
        transform,
        'transitionDuration': '0.25s',
        'transitionProperty': 'opacity, transform',
        'willChange': 'opacity, transform'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      duration: null,
      fromEdge: 'bottom'
    });
  }

  get duration() {
    return this.state.duration;
  }
  set duration(duration) {
    this.setState({ duration });
  }

  /* eslint-disable no-unused-vars */
  [symbols.elementsWithTransitions](visualState) {
    return [this.$.content];
  }

  get fromEdge() {
    return this.state.fromEdge;
  }
  set fromEdge(fromEdge) {
    this.setState({ fromEdge });
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    const rootEdgeStyles = {
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
    const rootEdgeStyle = rootEdgeStyles[this.state.fromEdge];

    const display = this.closed ?
      null :
      base.style && base.style.display || 'flex';

    return props.merge(base, {
      style: {
        'align-items': rootEdgeStyle['align-items'],
        display,
        'flex-direction': 'column',
        'height': '100%',
        'justify-content': rootEdgeStyle['justify-content'],
        'left': 0,
        'outline': 'none',
        'pointer-events': 'none',
        'position': 'fixed',
        'top': 0,
        '-webkit-tap-highlight-color': 'transparent',
        'width': '100%'
      }
    });
  }

  async open() {
    await this.startOpen();
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    props.apply(this.$.content, this.contentProps);
  }

  // TODO: Restore LanguageDirectionMixin
  get rightToLeft() {
    return false;
  }

  get [symbols.template]() {
    return `
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
