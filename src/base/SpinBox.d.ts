// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import FormElementMixin from "./FormElementMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";

export default class SpinBox extends FormElementMixin(ReactiveElement) {
  stepDown(): void;
  stepUp(): void;
  value: string;
}
