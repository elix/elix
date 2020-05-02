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

export const componentDidMount: "_componentDidMount";
export const componentDidUpdate: "_componentDidUpdate";
export const defaultState: "_defaultState";
export const delegatesFocus: "_delegatesFocus";
export const firstRender: "_firstRender";
export const focusTarget: "_focusTarget";
export const hasDynamicTemplate: "_hasDynamicTemplate";
export const ids: "_ids";
export const nativeInternals: "_nativeInternals";
export const raiseChangeEvents: "_raiseChangeEvents";
export const render: "_render";
export const renderChanges: "_renderChanges";
export const rendered: "_rendered";
export const rendering: "_rendering";
export const setState: "_setState";
export const shadowRoot: "_shadowRoot";
export const shadowRootMode: "_shadowRootMode";
export const state: "_state";
export const stateEffects: "_stateEffects";
export const template: "_template";
