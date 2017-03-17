/*
 * This file is transpiled to create an ES5-compatible distribution in which
 * the package's main feature(s) are available via the window.Elix global.
 * If you're already using ES6 yourself, ignore this file, and instead import
 * the source file(s) you want from the src folder.
 */


// Mixins
import AttributeMarshallingMixin from './mixins/AttributeMarshallingMixin';
import attributes from './mixins/attributes';
import ClickSelectionMixin from './mixins/ClickSelectionMixin';
import constants from './mixins/constants';
import content from './mixins/content';
import ContentItemsMixin from './mixins/ContentItemsMixin';
import defaultScrollTarget from './mixins/defaultScrollTarget';
import DefaultSlotContentMixin from './mixins/DefaultSlotContentMixin';
import DirectionSelectionMixin from './mixins/DirectionSelectionMixin';
import KeyboardDirectionMixin from './mixins/KeyboardDirectionMixin';
import KeyboardMixin from './mixins/KeyboardMixin';
import KeyboardPagedSelectionMixin from './mixins/KeyboardPagedSelectionMixin';
import KeyboardPrefixSelectionMixin from './mixins/KeyboardPrefixSelectionMixin';
import SelectionAriaMixin from './mixins/SelectionAriaMixin';
import SelectionInViewMixin from './mixins/SelectionInViewMixin';
import ShadowTemplateMixin from './mixins/ShadowTemplateMixin';
import SingleSelectionMixin from './mixins/SingleSelectionMixin';
import Symbol from './mixins/Symbol';
import symbols from './mixins/symbols';

// Elements
import ListBox from './elements/ListBox';
import Modes from './elements/Modes';


window.Elix = window.Elix || {};

// Mixins
window.Elix.AttributeMarshallingMixin = AttributeMarshallingMixin;
window.Elix.attributes = attributes;
window.Elix.ClickSelectionMixin = ClickSelectionMixin;
window.Elix.constants = constants;
window.Elix.content = content;
window.Elix.ContentItemsMixin = ContentItemsMixin;
window.Elix.defaultScrollTarget = defaultScrollTarget;
window.Elix.DefaultSlotContentMixin = DefaultSlotContentMixin;
window.Elix.DirectionSelectionMixin = DirectionSelectionMixin;
window.Elix.KeyboardDirectionMixin = KeyboardDirectionMixin;
window.Elix.KeyboardMixin = KeyboardMixin;
window.Elix.KeyboardPagedSelectionMixin = KeyboardPagedSelectionMixin;
window.Elix.KeyboardPrefixSelectionMixin = KeyboardPrefixSelectionMixin;
window.Elix.SelectionAriaMixin = SelectionAriaMixin;
window.Elix.SelectionInViewMixin = SelectionInViewMixin;
window.Elix.ShadowTemplateMixin = ShadowTemplateMixin;
window.Elix.SingleSelectionMixin = SingleSelectionMixin;
window.Elix.Symbol = Symbol;
window.Elix.symbols = symbols;

window.ListBox = ListBox;
window.Modes = Modes;
