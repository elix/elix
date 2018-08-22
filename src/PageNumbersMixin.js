import { html } from './template.js';
import { merge } from './updates.js';


const wrap = Symbol('wrap');


/**
 * Mixin that adds a page (item) number and total page (item) count to a
 * component like [Carousel](Carousel) that renders its contents as pages.
 * 
 * @module PageNumbersMixin
 */
function PageNumbersMixin(Base) {

  class PageNumbers extends Base {

    /**
     * Add the page numbers to a template.
     * 
     * @param {Node} original - the element that should be wrapped by page numbers
     */
    [wrap](original) {
      const result = html`
        <div id="pageNumbers" role="none" style="display: flex; flex: 1; overflow: hidden;">
          <style>
            #pageNumber {
              bottom: 0;
              color: white;
              padding: 0.5em;
              position: absolute;
              right: 0;
            }
          </style>
          <div id="pageNumbersContainer" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;"></div>
          <div id="pageNumber"></div>
        </div>
      `;
      const container = result.content.querySelector('#pageNumbersContainer');
      if (!container) {
        throw `Couldn't find element with ID "pageNumbersContainer".`;
      }
      container.appendChild(original);
      return result;
    }

    get updates() {
      const selectedIndex = this.selectedIndex || this.state.selectedIndex;
      const textContent = selectedIndex >= 0 && this.items ?
        `${selectedIndex + 1} / ${this.items.length}` :
        '';
      return merge(super.updates, {
        $: {
          pageNumber: {
            textContent
          }
        }
      });
    }

  }

  return PageNumbers;
}


PageNumbersMixin.wrap = wrap;


export default PageNumbersMixin;
