// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

declare const VisualStateMixin: Mixin<{
  componentDidMount?(): void;
  componentDidUpdate?(): void;
}, {
  componentDidMount(): void;
  componentDidUpdate(): void;
}>;

export default VisualStateMixin;
