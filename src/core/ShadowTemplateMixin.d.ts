// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import { ids, shadowRoot, shadowRootMode } from "./internal.js";

declare const ShadowTemplateMixin: Mixin<
  {},
  {
    readonly [ids]: {
      [id: string]: HTMLElement | SVGElement;
    };
    [shadowRoot]: ShadowRoot;
    [shadowRootMode]: "closed" | "open";
  }
>;

export default ShadowTemplateMixin;
