// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../src/shared.d.ts"/>

declare const TransitionEffectMixin: StateMixin<
{
  componentDidMount?(): void;
  componentDidUpdate?(): void;
},
{},
{
  componentDidMount(): void;
  componentDidUpdate(): void;
  startEffect(effect: string): Promise<void>;
},
{
  effect: string;
  effectPhase: string;
}>;

export default TransitionEffectMixin;
