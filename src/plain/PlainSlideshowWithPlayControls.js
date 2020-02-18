import SlideshowWithPlayControls from "../base/SlideshowWithPlayControls.js";
import PlainPlayControlsMixin from "./PlainPlayControlsMixin.js";

/**
 * SlideshowWithPlayControls component in the Plain reference design system
 *
 * @inherits SlideshowWithPlayControls
 */
class PlainSlideshowWithPlayControls extends PlainPlayControlsMixin(
  SlideshowWithPlayControls
) {}

export default PlainSlideshowWithPlayControls;
