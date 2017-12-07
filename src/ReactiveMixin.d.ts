// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

declare const ReactiveMixin: Mixin<{
  connectedCallback?(): void;
  defaultState?: PlainObject;
}, {
  componentDidMount(): void;
  componentDidUpdate(previousState: PlainObject): void;
  connectedCallback(): void;
  defaultState: PlainObject;
  render(): Promise<void>;
  setState(changes: PlainObject): Promise<void>;
  state: PlainObject;
  validateState(state: PlainObject): PlainObject;
}>;

export default ReactiveMixin;
