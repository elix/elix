// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import {
  defaultState,
  raiseChangeEvents,
  render,
  renderChanges,
  rendered,
  rendering,
  setState,
  state,
  stateEffects,
} from "./internal.js";

declare const ReactiveMixin: Mixin<
  {},
  {
    connectedCallback(): void;
    readonly [defaultState]: PlainObject;
    [raiseChangeEvents]: boolean;
    [render](changed: ChangedFlags): void;
    [renderChanges](): void;
    [rendered](changed: ChangedFlags): void;
    [rendering]: boolean;
    [setState](changes: PlainObject): Promise<void>;
    readonly [state]: PlainObject;
    [stateEffects](state: PlainObject, changed: ChangedFlags): PlainObject;
  }
>;

export default ReactiveMixin;
