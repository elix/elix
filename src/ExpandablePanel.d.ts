// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import TransitionEffectMixin from './TransitionEffectMixin.js';
import EffectMixin from './EffectMixin.js';

export default class ExpandablePanel extends OpenCloseMixin(
  EffectMixin(TransitionEffectMixin(ReactiveElement))
) {}
