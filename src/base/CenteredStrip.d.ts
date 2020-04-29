// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import EffectMixin from "./EffectMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ResizeMixin from "./ResizeMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapSelectionMixin from "./TapSelectionMixin.js";

export default class CenteredStrip extends EffectMixin(
  LanguageDirectionMixin(
    ResizeMixin(
      SingleSelectAPIMixin(SlotItemsMixin(TapSelectionMixin(ReactiveElement)))
    )
  )
) {}
