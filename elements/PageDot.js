/* Used by PageDotsMixin  */


import ElementBase from './ElementBase.js';
import * as props from '../mixins/props.js';
import symbols from '../mixins/symbols.js';


class PageDot extends ElementBase {

  get props() {
    const base = super.props || {};
    const desktop = matchMedia('(min-width: 768px)').matches;
    const size = desktop ? '12px' : null;
    return props.merge(super.props, {
      style: {
        'height': size || base.style && base.style.height,
        'width': size || base.style && base.style.width
      }
    });
  }

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

}

customElements.define('elix-page-dot', PageDot);
export default PageDot;
