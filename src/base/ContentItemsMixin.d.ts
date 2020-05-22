// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { isItemAvailable } from "./internal.js";

declare const ContentItemsMixin: StateMixin<
  {},
  {},
  {
    [isItemAvailable](item: ListItemElement, state: PlainObject): boolean;
  },
  {
    items: ListItemElement[];
  }
>;

export default ContentItemsMixin;
