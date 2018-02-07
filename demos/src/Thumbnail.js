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
    let src = '';
    let height = '';
    let width = '';
    const item = this.state.item;
    if (item) {
      src = item.src;
      height = `${item.naturalHeight / 10}px`;
      width = `${item.naturalWidth / 10}px`;
    }
    return merge(super.updates, {
      style: {
        height,
        width
      },
      $: {
        inner: { src }
      }
    });
  }

}


customElements.define('custom-thumbnail', Thumbnail);
export default Thumbnail;
