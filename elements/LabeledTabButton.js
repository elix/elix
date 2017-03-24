import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin';
import symbols from '../mixins/symbols';


/**
 * A classic rounded tab button.
 *
 * This component is used by [LabeledTabs](LabeledTabs.md), which will generate
 * an instance of `LabeledTabButton` for each panel in a set of tab panels.
 *
 * @extends HTMLElement
 * @mixes ShadowTemplateMixin
 */
class LabeledTabButton extends ShadowTemplateMixin(HTMLElement) {
  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-flex;
        }

        button {
          background: white;
          border: 1px solid #ccc;
          cursor: pointer;
          flex: 1;
          font-family: inherit;
          font-size: inherit;
          margin: 0;
          padding: 0.5em 0.75em;
          position: relative;
          transition: border-color 0.25s;
        }

        :host(.selected) button {
          border-color: #ccc;
          opacity: 1;
        }

        :host(:hover) button {
          background-color: #eee;
        }

        /* top/bottom positions */
        :host([tab-position="top"]:not(:last-child)),
        :host([tab-position="bottom"]:not(:last-child)) {
          margin-right: 0.2em;
        }

        /* top position */
        :host([tab-position="top"]) button {
          border-radius: 0.25em 0.25em 0 0;
          margin-bottom: -1px;
        }
        :host([tab-position="top"].selected) button {
          border-bottom-color: transparent;
        }

        /* bottom position */
        :host([tab-position="bottom"]) button {
          border-radius: 0 0 0.25em 0.25em;
          margin-top: -1px;
        }
        :host([tab-position="bottom"].selected) button {
          border-top-color: transparent;
        }

        /* left/right positions */
        :host([tab-position="left"]:not(:last-child)),
        :host([tab-position="right"]:not(:last-child)) {
          margin-bottom: 0.2em;
        }

        /* left position */
        :host([tab-position="left"]) button {
          border-radius: 0.25em 0 0 0.25em;
          margin-right: -1px;
        }
        :host([tab-position="left"].selected) button {
          border-right-color: transparent;
        }

        /* right position */
        :host([tab-position="right"]) button {
          border-radius: 0 0.25em 0.25em 0;
          margin-left: -1px;
        }
        :host([tab-position="right"].selected) button {
          border-left-color: transparent;
        }
      </style>

      <button tabindex="-1">
        <slot></slot>
      </button>
    `;
  }
}


customElements.define('elix-labeled-tab-button', LabeledTabButton);
export default LabeledTabButton;
