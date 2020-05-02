// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Button from "./Button.js";
import SelectableMixin from "./SelectableMixin.js";

export default class SelectableButton extends SelectableMixin(Button) {}
