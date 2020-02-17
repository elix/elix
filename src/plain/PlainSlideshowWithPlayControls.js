import SlideshowWithPlayControls from "../base/SlideshowWithPlayControls.js";
import PlainPlayControlsMixin from "./PlainPlayControlsMixin.js";

export default class PlainSlideshowWithPlayControls extends PlainPlayControlsMixin(
  SlideshowWithPlayControls
) {}
