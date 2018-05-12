import { merge } from './updates.js';


const inject = Symbol('inject');


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
     * @param {string} template - the inner template placed inside the page numbers container
     */
    [inject](template) {
      return `
        <style>
          #pageNumber {
            bottom: 0;
            color: white;
            padding: 0.5em;
            position: absolute;
            right: 0;
          }
        </style>
        <div id="pageNumbers" role="none" style="display: flex; flex: 1; overflow: hidden;">
          <div role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;">
            ${template}
          </div>
          <div id="pageNumber"></div>
        </div>
      `;
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


PageNumbersMixin.inject = inject;


export default PageNumbersMixin;
