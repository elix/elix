// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Button from "./Button.js";
import RepeatMousedownMixin from "./RepeatMousedownMixin.js";

export default class RepeatButton extends RepeatMousedownMixin(Button) {}
