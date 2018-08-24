import { getSuperProperty } from '../../src/workarounds.js';
import * as symbols from '../../src/symbols.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  ArrowDirectionMixin(
    SlidingPages
  );


class SlidingPagesWithArrows extends Base {

  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // Firefox doesn't support the pointer:fine media query, so we look for the
    // absence of pointer:coarse. Firefox doesn't support that either, but as of
    // Aug 2018, Firefox mobile usage is not significant. On desktop, at least,
    // Firefox will show the arrows.
    const finePointer = !window.matchMedia('(pointer:coarse)').matches;
    return Object.assign({}, super.defaultState, {
      showArrowButtons: finePointer
    });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super.template;
    const result = getSuperProperty(this, SlidingPagesWithArrows, symbols.template);
    this[ArrowDirectionMixin.wrap](result.content);
    return result;
  }

}


customElements.define('sliding-pages-with-arrows', SlidingPagesWithArrows);
export default SlidingPagesWithArrows;
