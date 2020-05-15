import Carousel from "./Carousel.js";
import { defaultState, render, state } from "./internal.js";

/**
 * Carousel showing a thumbnail for each image
 *
 * @inherits Carousel
 * @part {img} proxy
 */
class CarouselWithThumbnails extends Carousel {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      proxyListOverlap: false,
      proxyPartType: "img",
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    /** @type {Element[]} */ const proxies = this[state].proxies;
    if ((changed.items || changed.proxies) && proxies) {
      // Update thumbnails.
      const { items } = this[state];
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
