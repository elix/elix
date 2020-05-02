// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import TrackTextSelectionMixin from "./TrackTextSelectionMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

export default class Input extends DelegateInputLabelMixin(
  FocusVisibleMixin(
    FormElementMixin(TrackTextSelectionMixin(WrappedStandardElement))
  )
) {
  value: string;
}
