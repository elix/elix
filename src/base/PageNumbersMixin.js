import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

const wrap = Symbol("wrap");

/**
 * Adds a page number and total page count to a carousel-like element.
 *
 * This can be applied to components like [Carousel](Carousel) that renders
 * their content as pages.
 *
 * @module PageNumbersMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {div} page-number - the page number
 */
function PageNumbersMixin(Base) {
  class PageNumbers extends Base {
    [internal.render](/** @type {PlainObject} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }
      if (changed.selectedIndex) {
        const { items, selectedIndex } = this[internal.state];
        const textContent =
          selectedIndex >= 0 && items
            ? `${selectedIndex + 1} / ${items.length}`
            : "";
        this[internal.ids].pageNumber.textContent = textContent;
      }
    }

    /**
     * Destructively wrap a node with elements to show page numbers.
     *
     * @param {Node} original - the element that should be wrapped by page numbers
     */
    [wrap](original) {
      const pageNumbersTemplate = template.html`
        <div id="pageNumbers" role="none" style="display: flex; flex: 1; overflow: hidden;">
          <style>
            [part~="page-number"] {
              bottom: 0;
              color: white;
              padding: 0.5em;
              position: absolute;
              right: 0;
            }
          </style>
          <div id="pageNumbersContainer" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;"></div>
          <div id="pageNumber" part="page-number"></div>
        </div>
      `;
      template.wrap(
        original,
        pageNumbersTemplate.content,
        "#pageNumbersContainer"
      );
    }
  }

  return PageNumbers;
}

PageNumbersMixin.wrap = wrap;

export default PageNumbersMixin;
