import { html } from '../../src/template.js';
import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import ReactiveElement from '../../src/ReactiveElement.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';


const Base = 
  SlotContentMixin(
    ReactiveElement
  );


class LabeledColorSwatch extends Base {

  get [symbols.template]() {
    return html`
      <style>
        :host {
          align-items: center;
          display: inline-flex;
          white-space: nowrap;
        }

        #swatch {
          border-radius: 0.5em;
          box-shadow: 0 0 5px gray;
          box-sizing: border-box;
          display: inline-block;
          height: 1em;
          margin-right: 0.25em;
          width: 1em;
        }

        @media (pointer: coarse) {
          #swatch {
            margin-right: 0.5em;
          }
        }
      </style>
      <span id="swatch"></span>
      <span id="label">
        <slot></slot>
      </span>
    `;
  }

  get updates() {
    const content = this.state.content;
    const strings = content ? 
      content.map(node => node.textContent) :
      [];
    const color = strings.join('').toLowerCase();
    return merge(super.updates, {
      $: {
        swatch: {
          style: {
            background: color
          }
        }
      }
    });
  }
  
}


export default LabeledColorSwatch;
customElements.define('labeled-color-swatch', LabeledColorSwatch);
