// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import State from './State.js';

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
