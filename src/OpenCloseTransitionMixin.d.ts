// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

declare const OpenCloseTransitionMixin: Mixin<{
  componentDidMount?(): void;
  componentDidUpdate?(): void;
}, {
  componentDidMount(): void;
  componentDidUpdate(): void;
  startClose(): Promise<void>;
  startOpen(): Promise<void>;
  visualStates: any;
  whenTransitionEnds(expectedState: string): Promise<void>;
}>;

export default OpenCloseTransitionMixin;
