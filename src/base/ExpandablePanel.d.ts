// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import EffectMixin from "./EffectMixin.js";
import OpenCloseMixin from "./OpenCloseMixin.js";
import TransitionEffectMixin from "./TransitionEffectMixin.js";

export default class ExpandablePanel extends OpenCloseMixin(
  EffectMixin(TransitionEffectMixin(ReactiveElement))
) {}
