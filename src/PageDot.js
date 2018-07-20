import { html } from './templates.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js';


/**
 * A small dot used as a proxy element for an item in a [Carousel](Carousel).
 * 
 * @inherits ReactiveElement
 */
class PageDot extends ReactiveElement {

  get [symbols.template]() {
    return html`
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
