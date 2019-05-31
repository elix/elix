// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

import State from './State.js';
import * as symbols from './symbols.js';

declare const ReactiveMixin: Mixin<{}, {
  componentDidMount(): void;
  componentDidUpdate(changed: PlainObject): void;
  connectedCallback(): void;
  defaultState: State;
  render(): void;
  [symbols.render](changed: PlainObject): void;
  setState(changes: PlainObject): Promise<void>;
  state: State;
}>;

export default ReactiveMixin;
