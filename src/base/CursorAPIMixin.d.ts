// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

declare const CursorAPIMixin: Mixin<
  {},
  {
    currentIndex: number;
    currentItem: Element | null;
    currentItemRequired: boolean;
    cursorOperationsWrap: boolean;
    goFirst(): boolean;
    goLast(): boolean;
    goNext(): boolean;
    goPrevious(): boolean;
  }
>;

export default CursorAPIMixin;
