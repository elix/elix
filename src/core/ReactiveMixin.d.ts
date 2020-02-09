// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as internal from "./internal.js";

declare const ReactiveMixin: Mixin<
  {},
  {
    [internal.componentDidMount](): void;
    [internal.componentDidUpdate](changed: PlainObject): void;
    readonly [internal.defaultState]: PlainObject;
    [internal.raiseChangeEvents]: boolean;
    [internal.render](changed: PlainObject): void;
    [internal.renderChanges](): void;
    [internal.rendering]: boolean;
    [internal.setState](changes: PlainObject): Promise<void>;
    readonly [internal.state]: PlainObject;
    [internal.stateEffects](
      state: PlainObject,
      changed: PlainObject
    ): PlainObject;
  }
>;

export default ReactiveMixin;
