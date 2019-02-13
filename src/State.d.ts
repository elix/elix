// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare type ChangeHandler = (state: State, changed: PlainObject) => PlainObject|null;

export default class State {
  constructor(defaults?: PlainObject);
  copyWithChanges(changes: PlainObject): { state: State, changed: boolean };
  onChange(dependencies: string[]|string, callback: ChangeHandler);
  [key: string]: any;
}
