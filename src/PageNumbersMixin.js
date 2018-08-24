import { merge } from './updates.js';
import * as template from './template.js';


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
     * Destructively wrap a node with elements to show page numbers.
     * 
     * @param {Node} original - the element that should be wrapped by page numbers
     */
    [wrap](original) {
      const pageNumbersTemplate = template.html`
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
      template.wrap(original, pageNumbersTemplate.content, '#pageNumbersContainer');
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
