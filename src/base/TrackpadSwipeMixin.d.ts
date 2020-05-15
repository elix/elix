// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { swipeTarget } from "./internal.js";

declare const TrackpadSwipeMixin: StateMixin<
  {},
  {},
  {
    readonly [swipeTarget]: HTMLElement;
  },
  {
    swipeFraction: number;
  }
>;

export default TrackpadSwipeMixin;
