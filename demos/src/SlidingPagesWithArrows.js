import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import SlidingPages from '../../src/SlidingPages.js';


const Base =
  ArrowDirectionMixin(
    SlidingPages
  );


class SlidingPagesWithArrows extends Base {

  constructor() {
    super();
    this[symbols.renderedRoles] = {};
  }

  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // Firefox doesn't support the pointer:fine media query, so we look for the
    // absence of pointer:coarse. Firefox doesn't support that either, but as of
    // Aug 2018, Firefox mobile usage is not significant. On desktop, at least,
    // Firefox will show the arrows.
    const finePointer = !window.matchMedia('(pointer:coarse)').matches;
    return Object.assign(super.defaultState, {
      showArrowButtons: finePointer
    });
  }

  get [symbols.template]() {
    const base = super[symbols.template];
    this[ArrowDirectionMixin.wrap](base.content);
    return template.concat(base, template.html`
      <style>
        .arrowButton {
          font-size: 48px;
        }
      </style>
    `);
  }

}


customElements.define('sliding-pages-with-arrows', SlidingPagesWithArrows);
export default SlidingPagesWithArrows;
