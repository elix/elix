//
// Copyright © 2016-2017 Component Kitchen, Inc. and contributors to the 
// Elix Project
//

/*
 * This file is transpiled to create an ES5-compatible distribution in which
 * the package's main feature(s) are available via the window.Elix global.
 * If you're already using ES6 yourself, ignore this file, and instead import
 * the source file(s) you want from the src folder.
 */


// Import mixins
import AttributeMarshallingMixin from './mixins/AttributeMarshallingMixin';
import * as attributes from './mixins/attributes';
import ClickSelectionMixin from './mixins/ClickSelectionMixin';
import constants from './mixins/constants';
import * as content from './mixins/content';
import ContentItemsMixin from './mixins/ContentItemsMixin';
import defaultScrollTarget from './mixins/defaultScrollTarget';
import DefaultSlotContentMixin from './mixins/DefaultSlotContentMixin';
import DirectionSelectionMixin from './mixins/DirectionSelectionMixin';
import KeyboardDirectionMixin from './mixins/KeyboardDirectionMixin';
import KeyboardMixin from './mixins/KeyboardMixin';
import KeyboardPagedSelectionMixin from './mixins/KeyboardPagedSelectionMixin';
import KeyboardPrefixSelectionMixin from './mixins/KeyboardPrefixSelectionMixin';
import renderArrayAsElements from './mixins/renderArrayAsElements';
import SelectionAriaMixin from './mixins/SelectionAriaMixin';
import SelectionInViewMixin from './mixins/SelectionInViewMixin';
import ShadowReferencesMixin from './mixins/ShadowReferencesMixin';
import ShadowTemplateMixin from './mixins/ShadowTemplateMixin';
import SingleSelectionMixin from './mixins/SingleSelectionMixin';
import Symbol from './mixins/Symbol';
import symbols from './mixins/symbols';

// Import elements
import LabeledTabButton from './elements/LabeledTabButton';
import LabeledTabs from './elements/LabeledTabs';
import ListBox from './elements/ListBox';
import Modes from './elements/Modes';
import Tabs from './elements/Tabs';
import TabStrip from './elements/TabStrip';
import TabStripWrapper from './elements/TabStripWrapper';


// Create (or add to) Elix global, and add in all mixins and elements.
window.Elix = Object.assign(window.Elix || {}, {
  AttributeMarshallingMixin,
  attributes,
  ClickSelectionMixin,
  constants,
  content,
  ContentItemsMixin,
  defaultScrollTarget,
  DefaultSlotContentMixin,
  DirectionSelectionMixin,
  KeyboardDirectionMixin,
  KeyboardMixin,
  KeyboardPagedSelectionMixin,
  KeyboardPrefixSelectionMixin,
  renderArrayAsElements,
  SelectionAriaMixin,
  SelectionInViewMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin,
  SingleSelectionMixin,
  Symbol,
  symbols,
  LabeledTabButton,
  LabeledTabs,
  ListBox,
  Modes,
  Tabs,
  TabStrip,
  TabStripWrapper
});
