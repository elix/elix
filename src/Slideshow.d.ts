// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CrossfadeStage from "./CrossfadeStage.js";
import TimerSelectionMixin from "./TimerSelectionMixin.js";

export default class Slideshow extends TimerSelectionMixin(CrossfadeStage) {}
