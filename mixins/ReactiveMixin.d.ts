// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const ReactiveMixin: Mixin<{
  componentDidUpdate?(): void;
  connectedCallback?(): void;
}, {
  componentDidUpdate(): void;
  connectedCallback(): void;
  defaultState: any;
  render: Promise<void>;
  setState(any): Promise<void>;
  state: any;
}>;

export default ReactiveMixin;
