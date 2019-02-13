import { forwardFocus } from './utilities.js';
import { getSuperProperty } from './workarounds.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import AriaListMixin from './AriaListMixin.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import CenteredStripOpacity from './CenteredStripOpacity.js';
import DarkModeMixin from './DarkModeMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import Explorer from './Explorer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import PageDot from './PageDot.js';
import SlidingStage from './SlidingStage.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  ArrowDirectionMixin(
  DarkModeMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    Explorer
  )))))))))));


/**
 * Carousel with a sliding effect and navigation controls
 * 
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. This component shows a small dot for each of its
 * items, and displays a sliding effect when moving between items.
 * 
 * @inherits Explorer
 * @mixes AriaListMixin
 * @mixes ArrowDirectionMixin
 * @mixes DarkModeMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @elementrole {PageDot} proxy
 * @elementrole {CenteredStripOpacity} proxyList
 * @elementrole {SlidingStage} stage
 */
class Carousel extends Base {

  [symbols.beforeUpdate]() {
    const proxyListChanged = this[symbols.renderedRoles].proxyListRole
      !== this.state.proxyListRole;
    /** @type {any} */
    const cast = this.$.proxyList;
    if (proxyListChanged && cast) {
      // Turn off focus handling for old proxy list.
      forwardFocus(cast, null);
    }
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (proxyListChanged) {
      // Keep focus off of the proxies and onto the carousel itself.
      forwardFocus(cast, this);
    }
  }
  
  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // As of Mar 14 2018, Firefox does not yet support pointer queries, in which
    // case we assume use of a mouse.
    const pointerQuery = '(pointer: fine)';
    const mediaQueryList = window.matchMedia(pointerQuery);
    const showArrowButtons = mediaQueryList.media === pointerQuery ?
      mediaQueryList.matches :
      true;
    return Object.assign(super.defaultState, {
      orientation: 'horizontal',
      proxyListOverlap: true,
      proxyListPosition: 'bottom',
      proxyListRole: CenteredStripOpacity,
      proxyRole: PageDot,
      showArrowButtons,
      stageRole: SlidingStage
    });
  }

  proxyUpdates(proxy, calcs) {
    const base = super.proxyUpdates(proxy, calcs);
    const proxies = this.proxies;
    const proxiesSupportDarkMode = proxies && proxies[0] && 'darkMode' in proxies[0];
    const darkMode = this.state.darkMode;
    const setDarkMode = darkMode !== null && proxiesSupportDarkMode;
    return merge(
      base,
      {
        attributes: {
          tabindex: ''
        }
      },
      setDarkMode && {
        darkMode
      }
    );
  }

  get [symbols.swipeTarget]() {
    // Next line is same as: const base = super[symbols.swipeTarget]
    const base = getSuperProperty(this, Carousel, symbols.swipeTarget);
    return this.$.stage instanceof HTMLElement ?
      this.$.stage :
      base;
  }

  get [symbols.template]() {
    // Next line is same as: const base = super[symbols.template]
    const base = getSuperProperty(this, Carousel, symbols.template);
    const stage = base.content.querySelector('#stage');
    this[ArrowDirectionMixin.wrap](stage);
    return template.concat(base, template.html`
      <style>
        .arrowButton {
          font-size: 48px;
        }

        #proxyList {
          outline: none;
        }

        #stage {
          height: 100%;
          width: 100%;
        }
      </style>
    `);
  }

  get updates() {
    const { darkMode } = this.state;
    const arrowButtonUpdates = {};
    if (darkMode !== null) {
      if ('darkMode' in this.$.arrowButtonLeft) {
        arrowButtonUpdates.darkMode = darkMode;
      }
    }
    return merge(super.updates, {
      $: {
        arrowButtonLeft: arrowButtonUpdates,
        arrowButtonRight: arrowButtonUpdates,
        proxyList: {
          attributes: {
            tabindex: ''
          }
        },
        stage: {
          attributes: {
            tabindex: ''
          }
        }
      }
    });
  }

}


customElements.define('elix-carousel', Carousel);
export default Carousel;
