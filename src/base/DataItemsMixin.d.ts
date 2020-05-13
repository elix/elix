// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="../core/shared.d.ts"/>

import { renderDataToElement } from "./internal.js";

declare const DataItemsMixin: StateMixin<
  {},
  {},
  {
    [renderDataToElement](data: any, item: Element);
  },
  {
    data: any[];
    itemPartType: PartDescriptor;
    items: ListItemElement[];
  }
>;

export default DataItemsMixin;
