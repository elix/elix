import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ElementBase from './ElementBase.js';


/*
 * A small dot used by PageDotsMixin to represent a carousel item.
 * 
 * We don't expect this minor component to be used in other contexts, so it's
 * not documented as a supported Elix component.
 */
class PageDot extends ElementBase {

  get [symbols.template]() {
    return `
      <style>
        :host {
          background: rgb(255, 255, 255);
          border-radius: 7px;
          box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
          cursor: pointer;
          height: 8px;
          margin: 7px 5px;
          padding: 0;
          transition: opacity 0.2s;
          width: 8px;
        }
      </style>
    `;
  }

  get updates() {
    const base = super.updates || {};
    const desktop = matchMedia('(min-width: 768px)').matches;
    const size = desktop ? '12px' : null;
    return merge(super.updates, {
      attributes: {
        role: 'none'
      },
      style: {
        'height': size || base.style && base.style.height,
        'width': size || base.style && base.style.width
      }
    });
  }

}

customElements.define('elix-page-dot', PageDot);
export default PageDot;
