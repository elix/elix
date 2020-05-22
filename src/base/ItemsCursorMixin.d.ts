// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { goFirst, goLast, goNext, goPrevious } from "./internal.js";

declare const ItemsCursorMixin: StateMixin<
  {},
  {},
  {
    [goNext](): boolean;
    [goPrevious](): boolean;
    [goFirst](): boolean;
    [goLast](): boolean;
  },
  {
    currentIndex: number;
    currentItem: Element | null;
    currentItemRequired: boolean;
    cursorOperationsWrap: boolean;
  }
>;

export default ItemsCursorMixin;
