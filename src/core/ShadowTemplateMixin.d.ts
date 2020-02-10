// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import * as internal from "./internal.js";

declare const ShadowTemplateMixin: Mixin<
  {},
  {
    [internal.delegatesFocus]: boolean;
    [internal.focusTarget]: HTMLElement | null;
    [internal.hasDynamicTemplate]: boolean;
    readonly [internal.ids]: {
      [id: string]: HTMLElement | SVGElement;
    };
    connectedCallback(): void;
    shadowRoot: ShadowRoot;
    [internal.shadowRoot]: ShadowRoot;
    [internal.shadowRootMode]: "closed" | "open";
  }
>;

export default ShadowTemplateMixin;
