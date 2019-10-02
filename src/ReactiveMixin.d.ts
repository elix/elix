// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as internal from './internal.js';
import State from './State.js';

declare const ReactiveMixin: Mixin<
  {},
  {
    [internal.componentDidMount](): void;
    [internal.componentDidUpdate](
      /** @typeof {PlainObject} */ changed: PlainObject
    ): void;
    [internal.defaultState]: State;
    [internal.render](changed: PlainObject): void;
    [internal.renderChanges](): void;
    [internal.setState](changes: PlainObject): Promise<void>;
    [internal.state]: State;
  }
>;

export default ReactiveMixin;
