// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as internal from './internal.js';

declare const ContentItemsMixin: StateMixin<
  {},
  {},
  {
    items: ListItemElement[];
    [internal.itemMatchesState](
      item: ListItemElement,
      state: PlainObject
    ): boolean;
  },
  {
    items: ListItemElement[];
  }
>;

export default ContentItemsMixin;
