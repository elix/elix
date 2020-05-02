// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import EffectMixin from "./EffectMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ResizeMixin from "./ResizeMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TapCursorMixin from "./TapCursorMixin.js";

export default class CenteredStrip extends CursorAPIMixin(
  EffectMixin(
    ItemsAPIMixin(
      LanguageDirectionMixin(
        ResizeMixin(
          SingleSelectAPIMixin(SlotItemsMixin(TapCursorMixin(ReactiveElement)))
        )
      )
    )
  )
) {}
