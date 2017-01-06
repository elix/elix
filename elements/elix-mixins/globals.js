/*
 * This file is transpiled to create an ES5-compatible distribution in which
 * the package's main feature(s) are available via the window.Basic global.
 * If you're already using ES6 yourself, ignore this file, and instead import
 * the source file(s) you want from the src folder.
 */

import microtask from './src/microtask';
import SimpleAttributeMixin from './src/SimpleAttributeMixin';
import SimpleTemplateMixin from './src/SimpleTemplateMixin';
import SingleSelectionMixin from './src/SingleSelectionMixin';
import symbols from './src/symbols';

window.Elix = window.Elix || {};

window.Elix.microtask = microtask;
window.Elix.SimpleAttributeMixin = SimpleAttributeMixin;
window.Elix.SimpleTemplateMixin = SimpleTemplateMixin;
window.Elix.SingleSelectionMixin = SingleSelectionMixin;
window.Elix.symbols = symbols;
