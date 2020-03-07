import * as internal from "./internal.js";
import Carousel from "./Carousel.js";

/**
 * Carousel showing a thumbnail for each image
 *
 * @inherits Carousel
 * @part {img} proxy
 */
class CarouselWithThumbnails extends Carousel {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyListOverlap: false,
      proxyPartType: "img"
    });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    /** @type {Element[]} */ const proxies = this[internal.state].proxies;
    if ((changed.items || changed.proxies) && proxies) {
      // Update thumbnails.
      const { items } = this[internal.state];
      proxies.forEach((proxy, index) => {
        /** @type {any} */ const item = items[index];
        /** @type {any} */ const cast = proxy;
        if (item && typeof item.src === "string" && "src" in cast) {
          cast.src = item.src;
        }
      });
    }
  }
}

export default CarouselWithThumbnails;
