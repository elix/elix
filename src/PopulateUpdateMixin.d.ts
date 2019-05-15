// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const PopulateUpdateMixin: Mixin<{}, {
  [symbols.populate](changed: PlainObject): void;
  [symbols.update](changed: PlainObject): void;
}>;

export default PopulateUpdateMixin;
export const booleanAttributes: { [key: string]: boolean };
