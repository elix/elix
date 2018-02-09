import './Modes.js';
import './TabButton';
import './TabStrip.js';
import { merge } from './updates.js';
import Spotlight from './Spotlight.js';


class SpotlightTabs extends Spotlight {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      tabAlign: 'start'
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

  /**
   * The alignment of the tabs within the tab strip.
   * 
   * @type {('start'|'center'|'end'|'stretch')}
   * @default 'start'
   */
  get tabAlign() {
    return this.state.tabAlign;
  }
  set tabAlign(tabAlign) {
    this.setState({ tabAlign });
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
          attributes: {
            'tab-align': this.state.tabAlign
          },
          style: {
            'z-index': 1
          }
        }
      }
    });
  }

}


customElements.define('elix-spotlight-tabs', SpotlightTabs);
export default SpotlightTabs;
