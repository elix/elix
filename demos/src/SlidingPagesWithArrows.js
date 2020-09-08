import ArrowDirectionMixin from "../../src/base/ArrowDirectionMixin.js";
import { defaultState, template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import PlainArrowDirectionButton from "../../src/plain/PlainArrowDirectionButton.js";
import PlainArrowDirectionMixin from "../../src/plain/PlainArrowDirectionMixin.js";
import SlidingPages from "../../src/plain/PlainSlidingPages.js";

const Base = PlainArrowDirectionMixin(ArrowDirectionMixin(SlidingPages));

class SlidingPagesWithArrows extends Base {
  get [defaultState]() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // Firefox doesn't support the pointer:fine media query, so we look for the
    // absence of pointer:coarse. Firefox doesn't support that either, but as of
    // Aug 2018, Firefox mobile usage is not significant. On desktop, at least,
    // Firefox will show the arrows.
    const finePointer = !window.matchMedia("(pointer:coarse)").matches;
    return Object.assign(super[defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
      showArrowButtons: finePointer,
    });
  }

  get [template]() {
    const result = super[template];

    const slidingStageContent = result.content.getElementById(
      "slidingStageContent"
    );
    if (slidingStageContent) {
      /** @type {any} */ const cast = this;
      cast[ArrowDirectionMixin.wrap](slidingStageContent);
    }

    result.content.append(
      templateFrom.html`
        <style>
          [part~=arrow-icon] {
            font-size: 48px;
          }
        </style>
      `.content
    );

    return result;
  }
}

customElements.define("sliding-pages-with-arrows", SlidingPagesWithArrows);
export default SlidingPagesWithArrows;
