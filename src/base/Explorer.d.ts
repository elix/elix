// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import { checkSize } from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class Explorer extends CursorAPIMixin(
  CursorSelectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        LanguageDirectionMixin(
          SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement))
        )
      )
    )
  )
) {
  canGoNext: boolean;
  canGoPrevious: boolean;
  [checkSize](): void;
  readonly proxies: Element[];
  proxyListOverlap: boolean;
  proxyListPosition: "bottom" | "end" | "left" | "right" | "start" | "top";
  proxyListPartType: PartDescriptor;
  proxyPartType: PartDescriptor;
  stagePartType: PartDescriptor;
}
