// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../elix.d.ts"/>

declare const TransitionEffectMixin: Mixin<{
  connectedCallback?(): void;
}, {
  connectedCallback(): void;
}>;

export default TransitionEffectMixin;
