// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

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
