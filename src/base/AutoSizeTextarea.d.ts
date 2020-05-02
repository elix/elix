// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import FormElementMixin from "./FormElementMixin.js";
import SlotContentMixin from "./SlotContentMixin.js";
import TrackTextSelectionMixin from "./TrackTextSelectionMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

export default class AutoSizeTextarea extends FormElementMixin(
  SlotContentMixin(TrackTextSelectionMixin(WrappedStandardElement))
) {
  minimumRows: number;
  value: string;
}
