import ReactiveElement from '../../src/ReactiveElement.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';
import * as symbols from '../../src/symbols.js';
import { merge } from '../../src/updates.js';


const Base = 
  SlotContentMixin(
    ReactiveElement
  );


class LabeledColorSwatch extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
          white-space: nowrap;
        }

        #swatch {
          border: 1px solid lightgray;
          display: inline-block;
          height: 1em;
          vertical-align: middle;
          width: 1em;
        }

        #label {
          vertical-align: middle;
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
