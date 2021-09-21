// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

declare const TimerCursorMixin: Mixin<
  {},
  {
    cursorTimerDuration: number;
    pause(): void;
    play(): void;
    playing: boolean;
  }
>;

export default TimerCursorMixin;
