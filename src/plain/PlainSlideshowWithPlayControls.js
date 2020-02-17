import SlideshowWithPlayControls from "../base/SlideshowWithPlayControls.js";
import PlainPlayControlsMixin from "./PlainPlayControlsMixin.js";

/**
 * SlideshowWithPlayControls component in the Plain reference design system
 *
 * @inherits SlideshowWithPlayControls
 */
export default class PlainSlideshowWithPlayControls extends PlainPlayControlsMixin(
  SlideshowWithPlayControls
) {}
