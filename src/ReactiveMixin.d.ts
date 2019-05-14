// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import State from 'State.js';

declare const ReactiveMixin: Mixin<{
  connectedCallback?(): void;
}, {
  componentDidMount(): void;
  componentDidUpdate(changed: PlainObject): void;
  connectedCallback(): void;
  defaultState: State;
  render(changed: PlainObject): Promise<void>;
  setState(changes: PlainObject): Promise<void>;
  state: State;
}>;

export default ReactiveMixin;
