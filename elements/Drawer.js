import DialogModalityMixin from '../mixins/DialogModalityMixin.js';
import ExpandCollapseMixin from '../mixins/ExpandCollapseMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
// import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin.js';
import ModalBackdrop from './ModalBackdrop.js'; // eslint-disable-line no-unused-vars
import OverlayMixin from '../mixins/OverlayMixin.js';
import * as props from '../mixins/props.js';
import symbols from '../mixins/symbols.js';
import TouchSwipeMixin from '../mixins/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../mixins/TrackpadSwipeMixin.js';
import VisualStateMixin from '../mixins/VisualStateMixin.js';
import ElementBase from './ElementBase.js';

const Base =
  // FocusCaptureWrapper(
  DialogModalityMixin(
  ExpandCollapseMixin(
  KeyboardMixin(
  OverlayMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
  VisualStateMixin(
    ElementBase
  )))))));


/**
 * A drawer is a modal container generally used to provide navigation in
 * situations where: a) screen real estate is constrained and b) the navigation
 * UI is not critical to completing the user’s primary goal (and, hence, not
 * critical to the application’s business goal).
 * 
 * Dialog uses `BackdropWrapper` to add a backdrop behind the main overlay
 * content. Both the backdrop and the dialog itself can be styled.
 * 
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes BackdropWrapper
 * @mixes DialogModalityMixin
 * @mixes FocusCaptureWrapper
 * @mixes KeyboardMixin
 * @mixes OpenCloseMixin
 * @mixes OverlayMixin
 * @mixes ShadowTemplateMixin
 * @mixes TransitionEffectMixin
 */
class Drawer extends Base {

  backdropProps() {
    const swiping = this.state.swipeFraction !== null;
    const swipeFraction = Math.max(Math.min(this.state.swipeFraction, 1), 0);
    const opacity = !this.opened ?
      0 :
      0.2 * (1 - swipeFraction);
    return {
      style: {
        opacity,
        'transition': !swiping && 'opacity 0.25s linear',
        'willChange': 'opacity'
      }
    };
  }

  contentProps() {
    const sign = this.rightToLeft ? -1 : 1;
    const swiping = this.state.swipeFraction !== null;
    const swipeFraction = Math.max(Math.min(sign * this.state.swipeFraction, 1), 0);
    const transform = !this.opened ?
      'translateX(-100%)' :
      `translateX(${-sign * swipeFraction * 100}%)`;
    return {
      style: {
        'background': 'white',
        'border': '1px solid rgba(0, 0, 0, 0.2)',
        'boxShadow': '0 2px 10px rgba(0, 0, 0, 0.5)',
        'position': 'relative',
        transform,
        'transition': !swiping && 'transform 0.25s',
        'willChange': 'transform'
      }
    };
  }

  async close() {
    await this.collapse();
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectedIndex: 0
    });
  }

  /* eslint-disable no-unused-vars */
  [symbols.elementsWithTransitions](visualState) {
    return [this.$.content];
  }

  hostProps(original) {
    const base = super.hostProps ? super.hostProps(original) : {};
    const display = this.closed ?
      null :
      base.style && base.style.display || 'flex';
    return props.merge(base, {
      style: {
        'alignItems': 'stretch',
        display,
        'flexDirection': 'row',
        'left': 0,
        'height': '100%',
        'justifyContent': 'flex-start',
        'outline': 'none',
        'position': 'fixed',
        'top': 0,
        'WebkitTapHighlightColor': 'transparent',
        'width': '100%'
      }
    });
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }
    props.apply(this.$.backdrop, this.backdropProps());
    props.apply(this.$.content, this.contentProps());
  }

  async open() {
    await this.expand();
  }

  // TODO: Restore LanguageDirectionMixin
  get rightToLeft() {
    return false;
  }

  [symbols.shadowCreated]() {
    if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
    // Implicitly close on background clicks.
    this.$.backdrop.addEventListener('click', () => {
      this.close();
    });
  }

  get [symbols.template]() {
    return `
      <elix-modal-backdrop id="backdrop"></elix-modal-backdrop>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }

  async swipeLeft() {
    if (!this.rightToLeft) {
      const visualState = this.state.swipeFraction >= 1 ?
        this.visualStates.closed :
        this.visualStates.collapsing;
      await this.setState({ visualState });
    }
  }

  async swipeRight() {
    if (this.rightToLeft) {
      const visualState = this.state.swipeFraction <= -1 ?
        this.visualStates.closed :
        this.visualStates.collapsing;
      await this.setState({ visualState });
    }
  }

  get swipeTarget() {
    return this.$.content;
  }

}


customElements.define('elix-drawer', Drawer);
export default Drawer;
