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

export const checkSize: "_checkSize";
export const componentDidMount: "_componentDidMount";
export const componentDidUpdate: "_componentDidUpdate";
export const contentSlot: "_contentSlot";
export const defaultState: "_defaultState";
export const defaultTabIndex: "_defaultTabIndex";
export const delegatesFocus: "_delegatesFocus";
export const effectEndTarget: "_effectEndTarget";
export const event: "_event";
export const firstRender: "_firstRender";
export const focusTarget: "_focusTarget";
export const getItemText: "_getItemText";
export const goDown: "_goDown";
export const goEnd: "_goEnd";
export const goLeft: "_goLeft";
export const goNext: "_goNext";
export const goPrevious: "_goPrevious";
export const goRight: "_goRight";
export const goStart: "_goStart";
export const goUp: "_goUp";
export const hasDynamicTemplate: "_hasDynamicTemplate";
export const ids: "_ids";
export const itemMatchesState: "_itemMatchesState";
export const itemsDelegate: "_itemsDelegate";
export const keydown: "_keydown";
export const mouseenter: "_mouseenter";
export const mouseleave: "_mouseleave";
export const nativeInternals: "_nativeInternals";
export const populate: "_populate";
export const raiseChangeEvents: "_raiseChangeEvents";
export const render: "_render";
export const renderChanges: "_renderChanges";
export const rendered: "_rendered";
export const rendering: "_rendering";
export const scrollTarget: "_scrollTarget";
export const setState: "_setState";
export const shadowRoot: "_shadowRoot";
export const shadowRootMode: "_shadowRootMode";
export const startEffect: "_startEffect";
export const state: "_state";
export const stateEffects: "_stateEffects";
export const swipeDown: "_swipeDown";
export const swipeDownComplete: "_swipeDownComplete";
export const swipeLeft: "_swipeLeft";
export const swipeLeftTransitionEnd: "_swipeLeftTransitionEnd";
export const swipeRight: "_swipeRight";
export const swipeRightTransitionEnd: "_swipeRightTransitionEnd";
export const swipeStart: "_swipeStart";
export const swipeTarget: "_swipeTarget";
export const swipeUp: "_swipeUp";
export const swipeUpComplete: "_swipeUpComplete";
export const tap: "_tap";
export const template: "_template";
export const update: "_update";
