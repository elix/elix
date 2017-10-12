// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../elix.d.ts"/>

declare const ReactiveMixin: Mixin<{
  connectedCallback?(): void;
}, {
  connectedCallback(): void;
  defaultState: object;
  render: Promise<void>;
  setState(object): Promise<void>;
  state: object;
}>;

export default ReactiveMixin;
