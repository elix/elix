import * as internal from './internal.js';
import * as template from './template.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';
import EffectMixin from './EffectMixin.js';

const Base = OpenCloseMixin(
  EffectMixin(TransitionEffectMixin(ReactiveElement))
);

/**
 * Region that expands/collapses in place with an animated transition
 *
 * [A region that can be expanded and collapsed](/demos/expandablePanel.html)
 *
 * This component combines [OpenCloseMixin](OpenCloseMixin),
 * [TransitionEffectMixin](TransitionEffectMixin) and a simple CSS height
 * animation.
 *
 * This component handles only the duties of collapsing and expanding. It does
 * not provide a user interface for the user to trigger the change in state;
 * you must provide that user interface yourself.
 *
 * @inherits ReactiveElement
 * @mixes OpenCloseMixin
 * @mixes EffectMixin
 * @mixes TransitionEffectMixin
 */
class ExpandablePanel extends Base {
  get [internal.effectEndTarget]() {
    return this[internal.ids].outerContainer;
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.effect || changed.effectPhase || changed.enableEffects) {
      const { effect, effectPhase, enableEffects } = this[internal.state];

      // The inner container lets us measure how tall the content wants to be.
      const naturalHeight = this[
        internal.ids
      ].innerContainer.getBoundingClientRect().height;

      // The effect phase (before, during, after) determines which height we apply
      // to the outer container.
      /** @type {IndexedObject<PlainObject>} */
      const phaseHeights = {
        open: {
          before: '0px',
          during: `${naturalHeight}px`,
          after: ''
        },
        close: {
          before: `${naturalHeight}px`,
          during: '0px',
          after: '0px'
        }
      };
      const height = phaseHeights[effect][effectPhase];

      // This animates an element's height, which may not produce the smoothest
      // results. See
      // https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse.
      // Animating height does have the advantage of letting you set the height of
      // the panel's collapsed state by setting the panel's `min-height`.
      const transition =
        enableEffects && effectPhase === 'during' ? 'height 0.25s' : null;

      Object.assign(this[internal.ids].outerContainer.style, {
        height,
        transition
      });
    }
    if (changed.opened || changed.tabIndex) {
      // We only set aria-expanded if this component can get the keyboard focus
      // (which it usually won't).
      const canReceiveFocus = this[internal.state].tabIndex >= 0;
      if (canReceiveFocus) {
        this.setAttribute(
          'aria-expanded',
          this[internal.state].opened.toString()
        );
      } else {
        this.removeAttribute('aria-expanded');
      }
    }
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: block;
          overflow: hidden;
        }
      </style>
      <div id="outerContainer" role="none">
        <div id="innerContainer" role="none">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

export default ExpandablePanel;
