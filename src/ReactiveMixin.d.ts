// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import State from 'State';

declare const ReactiveMixin: Mixin<{
  connectedCallback?(): void;
}, {
  componentDidMount(): void;
  componentDidUpdate(previousState: State): void;
  connectedCallback(): void;
  defaultState: State;
  render(): Promise<void>;
  setState(changes: PlainObject): Promise<void>;
  shouldComponentUpdate(nextState: State): boolean;
  state: State;
}>;

export default ReactiveMixin;
