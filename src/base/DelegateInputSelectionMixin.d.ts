// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

declare const DelegateInputSelectionMixin: Mixin<
  {},
  {
    select: void;
    selectionEnd: number;
    selectionStart: number;
    setRangeText(replacement: string): void;
    setRangeText(
      replacement: string,
      start?: number,
      end?: number,
      selectMode?: "select" | "start" | "end" | "preserve"
    ): void;
    setSelectionRange(
      start: number,
      end: number,
      direction?: "forward" | "backward" | "none" | undefined
    ): void;
  }
>;

export default DelegateInputSelectionMixin;
