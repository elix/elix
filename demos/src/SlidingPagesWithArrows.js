import ArrowDirectionMixin from "../../src/base/ArrowDirectionMixin.js";
import { defaultState, template } from "../../src/base/internal.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import PlainArrowDirectionButton from "../../src/plain/PlainArrowDirectionButton.js";
import PlainArrowDirectionMixin from "../../src/plain/PlainArrowDirectionMixin.js";
import SlidingPages from "../../src/plain/PlainSlidingPages.js";

const Base = ArrowDirectionMixin(SlidingPages);

class SlidingPagesWithArrows extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
      showArrowButtons: true,
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
          [part~="arrow-icon"] {
            font-size: 48px;
          }
        </style>
      `.content
    );

    return result;
  }
}

// We need to apply our plain styling in PlainArrowDirectionMixin *after* the
// class above has invoked ArrowDirectionMixin to wrap the stage with arrows.
class PlainSlidingPagesWithArrows extends PlainArrowDirectionMixin(
  SlidingPagesWithArrows
) {}

customElements.define("sliding-pages-with-arrows", PlainSlidingPagesWithArrows);
export default SlidingPagesWithArrows;
