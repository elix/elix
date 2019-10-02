// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import EffectMixin from './EffectMixin.js';
import Modes from './Modes.js';

export default class CrossfadeStage extends EffectMixin(Modes) {
  transitionDuration: number;
}
