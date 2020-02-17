// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DarkModeMixin from "../base/DarkModeMixin.js";
import SelectableButton from "../base/SelectableButton.js";

export default class PageDot extends DarkModeMixin(SelectableButton) {}
