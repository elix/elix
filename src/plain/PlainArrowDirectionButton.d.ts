// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Button from "../base/Button.js";
import DarkModeMixin from "../base/DarkModeMixin.js";

export default class PlainArrowDirectionButton extends DarkModeMixin(Button) {}
