// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const TransitionEffectMixin: StateMixin<
{
  componentDidMount?(): void;
  componentDidUpdate?(previousState: PlainObject): void;
},
{},
{
  componentDidMount(): void;
  componentDidUpdate(previousState: PlainObject): void;
  startEffect(effect: string): Promise<void>;
},
{
  effect: string;
  effectPhase: string;
}>;

export default TransitionEffectMixin;
