/*
 * The Elix project makes pervasive use of shared Symbol objects as indexers
 * to avoid accidental name conflicts.
 * 
 * Unforunately, as of Aug 2018, TypeScript no longer considers this to be
 * valid, and will log a type error. See
 * https://github.com/Microsoft/TypeScript/issues/1863.
 * 
 * The best workaround we have found is to declare shared Symbol objects (below,
 * and also inline in various components and mixins) to be string literals
 * instead. This suppresses the type errors, while still allowing the real
 * Symbol objects to be used at runtime as desired.
 */

export const checkSize: '_checkSize';
export const contentSlot: '_contentSlot';
export const defaultTabIndex: '_defaultTabIndex';
export const delegatesFocus: '_delegatesFocus';
export const elementsWithTransitions: '_elementsWithTransitions';
export const event: '_event';
export const focusTarget: '_focusTarget';
export const getItemText: '_getItemText';
export const goDown: '_goDown';
export const goEnd: '_goEnd';
export const goLeft: '_goLeft';
export const goRight: '_goRight';
export const goStart: '_goStart';
export const goUp: '_goUp';
export const hasDynamicTemplate: '_hasDynamicTemplate';
export const itemMatchesState: '_itemMatchesState';
export const itemsDelegate: '_itemsDelegate';
export const keydown: '_keydown';
export const mouseenter: '_mouseenter';
export const mouseleave: '_mouseleave';
export const populate: '_populate';
export const raiseChangeEvents: '_raiseChangeEvents';
export const render: '_render';
export const rendering: '_rendering';
export const scrollTarget: '_scrollTarget';
export const startEffect: '_startEffect';
export const swipeDown: '_swipeDown';
export const swipeLeft: '_swipeLeft';
export const swipeRight: '_swipeRight';
export const swipeTarget: '_swipeTarget';
export const swipeUp: '_swipeUp';
export const tap: '_tap';
export const template: '_template';
export const update: '_update';
