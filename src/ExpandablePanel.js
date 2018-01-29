import { merge } from './updates.js';
import * as symbols from './symbols.js'
import ElementBase from './ElementBase.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';


const Base =
  OpenCloseMixin(
  TransitionEffectMixin(
    ElementBase
  ));


/**
 * A panel which expands/collapses vertically with an animated transition.
 * 
 * [A region that can be expanded and collapsed](/demos/expandablePanel.html)
 *
 * This component combines [OpenCloseMixin](OpenCloseMixin),
 * [TransitionEffectMixin](TransitionEffectMixin) and a simple CSS height
 * animation.
 * 
 * Note that animating an element's height [may not always produce the smoothest
 * results](https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse).
 * However, animating height does have the advantage of letting you set the
 * height of the panel's collapsed state by setting the panel's `min-height`.
 *
 * This component handles only the duties of collapsing and expanding. It does
 * not provide a user interface for the user to trigger the change in state;
 * you must provide that user interface yourself.
 * 
 * @inherits ElementBase
 * @mixes OpenCloseMixin
 * @mixes TransitionEffectMixin
 */
class ExpandablePanel extends Base {

  get [symbols.elementsWithTransitions]() {
    return [this.$.outerContainer];
  }
  
  get updates() {
    
    const effect = this.state.effect;
    const phase = this.state.effectPhase;
    
    // The inner container lets us measure how tall the content wants to be.
    const naturalHeight = this.$.innerContainer.getBoundingClientRect().height;

    // The effect phase (before, during, after) determines which height we apply
    // to the outer container.
    const phaseHeights = {
      'open': {
        'before': '0px',
        'during': `${naturalHeight}px`,
        'after': ''
      },
      'close': {
        'before': `${naturalHeight}px`,
        'during': '0px',
        'after': '0px'
      }
    };
    const height = phaseHeights[effect][phase];
    const transition = phase === 'during' ? 'height 0.25s' : '';

    return merge(super.updates, {
      attributes: {
        'aria-expanded': this.opened
      },
      $: {
        outerContainer: {
          style: {
            height,
            transition
          }
        }
      }
    });
  }
  
  get [symbols.template]() {
    return `
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


customElements.define('elix-expandable-panel', ExpandablePanel);
export default ExpandablePanel;
