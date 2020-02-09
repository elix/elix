// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import FormElementMixin from "./FormElementMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

export default class Input extends FormElementMixin(WrappedStandardElement) {
  value: string;
}
