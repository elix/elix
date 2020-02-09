// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import EffectMixin from "./EffectMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import TouchSwipeMixin from "./TouchSwipeMixin.js";

export default class PullToRefresh extends EffectMixin(
  TouchSwipeMixin(ReactiveElement)
) {
  pullIndicatorPartType: PartDescriptor;
  refreshing: boolean;
  refreshingIndicatorPartType: PartDescriptor;
}
