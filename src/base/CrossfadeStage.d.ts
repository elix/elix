// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import EffectMixin from "./EffectMixin.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import Modes from "./Modes.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";
import TransitionEffectMixin from "./TransitionEffectMixin.js";

export default class CrossfadeStage extends CursorAPIMixin(
  CursorSelectMixin(
    EffectMixin(
      ItemsAPIMixin(
        ItemsCursorMixin(
          SingleSelectAPIMixin(SlotItemsMixin(TransitionEffectMixin(Modes)))
        )
      )
    )
  )
) {
  transitionDuration: number;
}
