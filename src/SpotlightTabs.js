import './Modes.js';
import './TabButton';
import './TabStrip.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import Spotlight from './Spotlight.js';


const Base =
  AriaListMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
    Spotlight
  )))));


class SpotlightTabs extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal'
    });
  }

  setAvatarItem(avatar, item) {
    super.setAvatarItem(avatar, item);
    const label = item.getAttribute('aria-label') || item.alt;
    // const panelId = getIdForPanel(element, panel, index);
    // const id = getIdForTabButton(element, index);
    // avatar.setAttribute('id', id);
    // avatar.setAttribute('aria-controls', panelId);
    avatar.textContent = label;
  }

  get tags() {
    const base = super.tags || {};
    return Object.assign({}, base, {
      avatar: 'elix-tab-button',
      cast: 'elix-tab-strip',
      stage: 'elix-modes'
    })
  }
  set tags(tags) {
    super.tags = tags;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        cast: {
          style: {
            'z-index': '1'
          }
        }
      }
    });
  }

}


customElements.define('elix-spotlight-tabs', SpotlightTabs);
export default SpotlightTabs;
