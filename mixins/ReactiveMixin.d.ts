// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const ReactiveMixin: Mixin<{
  componentDidUpdate?(): void;
  connectedCallback?(): void;
  defaultState?: PlainObject;
}, {
  componentDidUpdate(): void;
  connectedCallback(): void;
  defaultState: PlainObject;
  render: Promise<void>;
  setState(changes: PlainObject): Promise<void>;
  state: PlainObject;
}>;

export default ReactiveMixin;
