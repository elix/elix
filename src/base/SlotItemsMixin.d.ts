// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { contentSlot } from "./internal.js";

declare const SlotItemsMixin: StateMixin<
  {},
  {},
  {
    [contentSlot]: HTMLSlotElement;
  },
  {
    content: Node[];
    items: ListItemElement[];
  }
>;

export default SlotItemsMixin;
