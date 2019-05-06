// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

import * as symbols from './symbols.js';

declare const TransitionEffectMixin: StateMixin<
{},
{},
{
  startEffect(effect: string): Promise<void>;
  [symbols.elementsWithTransitions]: Element[];
},
{
  effect: string;
  effectPhase: string;
}>;

export default TransitionEffectMixin;
