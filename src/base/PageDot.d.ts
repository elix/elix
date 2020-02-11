// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DarkModeMixin from "./DarkModeMixin.js";
import SelectableButton from "./SelectableButton.js";

export default class PageDot extends DarkModeMixin(SelectableButton) {}
