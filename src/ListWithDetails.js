import './ListBox.js';
import { merge } from './updates.js';
import Spotlight from './Spotlight.js';


class ListWithDetails extends Spotlight {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      castPosition: 'left',
      orientation: 'vertical'
    });
  }

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        cast: 'elix-list-box'
      })
    });
  }

  setAvatarItem(avatar, item) {
    super.setAvatarItem(avatar, item);
    const label = item.getAttribute('aria-label') || item.alt;
    avatar.textContent = label;
  }

}


customElements.define('elix-list-with-details', ListWithDetails);
export default ListWithDetails;
