// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import State from './State.js';

declare const ReactiveMixin: Mixin<{
  connectedCallback?(): void;
}, {
  componentDidMount(): void;
  componentDidUpdate(previousState: PlainObject): void;
  connectedCallback(): void;
  defaultState: State;
  refineState(state: PlainObject): boolean;
  render(): Promise<void>;
  setState(changes: PlainObject): Promise<void>;
  shouldComponentUpdate(nextState: PlainObject): boolean;
  state: PlainObject;
}>;

export default ReactiveMixin;
