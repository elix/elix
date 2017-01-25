/*
 * This file is transpiled to create an ES5-compatible distribution in which
 * the package's main feature(s) are available via the window.Elix global.
 * If you're already using ES6 yourself, ignore this file, and instead import
 * the source file(s) you want from the src folder.
 */

import microtask from './src/microtask';
import SelectionAriaMixin from './src/SelectionAriaMixin';
import ShadowTemplateMixin from './src/ShadowTemplateMixin';
import SingleSelectionMixin from './src/SingleSelectionMixin';
import Symbol from './src/Symbol';
import symbols from './src/symbols';

window.Elix = window.Elix || {};

window.Elix.microtask = microtask;
window.Elix.SelectionAriaMixin = SelectionAriaMixin;
window.Elix.ShadowTemplateMixin = ShadowTemplateMixin;
window.Elix.SingleSelectionMixin = SingleSelectionMixin;
window.Elix.Symbol = Symbol;
window.Elix.symbols = symbols;
