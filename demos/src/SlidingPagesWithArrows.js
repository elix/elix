import * as internal from "../../src/internal.js";
import * as template from "../../src/core/template.js";
import ArrowDirectionMixin from "../../src/ArrowDirectionMixin.js";
import SlidingPages from "../../src/SlidingPages.js";

const Base = ArrowDirectionMixin(SlidingPages);

class SlidingPagesWithArrows extends Base {
  get [internal.defaultState]() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // Firefox doesn't support the pointer:fine media query, so we look for the
    // absence of pointer:coarse. Firefox doesn't support that either, but as of
    // Aug 2018, Firefox mobile usage is not significant. On desktop, at least,
    // Firefox will show the arrows.
    const finePointer = !window.matchMedia("(pointer:coarse)").matches;
    return Object.assign(super[internal.defaultState], {
      showArrowButtons: finePointer
    });
  }

  get [internal.template]() {
    const base = super[internal.template];
    /** @type {any} */ const cast = this;
    cast[ArrowDirectionMixin.wrap](base.content);
    return template.concat(
      base,
      template.html`
      <style>
        .arrowButton {
          font-size: 48px;
        }
      </style>
    `
    );
  }
}

customElements.define("sliding-pages-with-arrows", SlidingPagesWithArrows);
export default SlidingPagesWithArrows;
