import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import WrappedStandardElement from "../../src/WrappedStandardElement.js";


class Thumbnail extends WrappedStandardElement.wrap('img') {

  get item() {
    return this.state.item;
  }
  set item(item) {
    this.setState({ item });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        img {
          height: 100%;
          object-fit: contain;
          width: 100%;
        }
      </style>
      <img id="inner">
    `;
  }

  get updates() {
    const src = this.state.item ?
      this.state.item.src :
      '';
    return merge(super.updates, {
      $: {
        inner: { src }
      }
    });
  }

}


customElements.define('custom-thumbnail', Thumbnail);
export default Thumbnail;
