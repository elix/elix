// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import EffectMixin from "./EffectMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class SlidingStage extends EffectMixin(
  LanguageDirectionMixin(SingleSelectionMixin(SlotItemsMixin(ReactiveElement)))
) {}
