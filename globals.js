/*
 * This file is transpiled to create an ES5-compatible distribution in which
 * the package's main feature(s) are available via the window.Elix global.
 * If you're already using ES6 yourself, ignore this file, and instead import
 * the source file(s) you want from the src folder.
 */


// Import mixins
// import * as attributes from './mixins/attributes.js';
// import * as content from './mixins/content.js';
// import AttributeMarshallingMixin from './mixins/AttributeMarshallingMixin.js';
// import ClickSelectionMixin from './mixins/ClickSelectionMixin.js';
// import constants from './mixins/constants.js';
// import ContentItemsMixin from './mixins/ContentItemsMixin.js';
// import defaultScrollTarget from './mixins/defaultScrollTarget.js';
// import DefaultSlotContentMixin from './mixins/DefaultSlotContentMixin.js';
// import DirectionSelectionMixin from './mixins/DirectionSelectionMixin.js';
// import KeyboardDirectionMixin from './mixins/KeyboardDirectionMixin.js';
// import KeyboardMixin from './mixins/KeyboardMixin.js';
// import KeyboardPagedSelectionMixin from './mixins/KeyboardPagedSelectionMixin.js';
// import KeyboardPrefixSelectionMixin from './mixins/KeyboardPrefixSelectionMixin.js';
// import OpenCloseMixin from './mixins/OpenCloseMixin.js';
// import OverlayMixin from './mixins/OverlayMixin.js';
// import renderArrayAsElements from './mixins/renderArrayAsElements.js';
// import SelectionAriaMixin from './mixins/SelectionAriaMixin.js';
// import SelectionInViewMixin from './mixins/SelectionInViewMixin.js';
// import ShadowReferencesMixin from './mixins/ShadowReferencesMixin.js';
// import ShadowTemplateMixin from './mixins/ShadowTemplateMixin.js';
// import SingleSelectionMixin from './mixins/SingleSelectionMixin.js';
// import Symbol from './mixins/Symbol.js';
// import symbols from './mixins/symbols.js';
// import TransitionEffectMixin from './mixins/TransitionEffectMixin.js';

// Import elements
// import AlertDialog from './elements/AlertDialog.js';
import Dialog from './elements/Dialog.js';
// import Drawer from './elements/Drawer.js';
// import LabeledTabButton from './elements/LabeledTabButton.js';
// import LabeledTabs from './elements/LabeledTabs.js';
import ListBox from './elements/ListBox.js';
import Modes from './elements/Modes.js';
// import Popup from './elements/Popup.js';
import Tabs from './elements/Tabs.js';
import TabStrip from './elements/TabStrip.js';
// import TabStripWrapper from './elements/TabStripWrapper.js';
// import Toast from './elements/Toast.js';


// The complete list of all mixins and elements.
const Elix = {
  // AttributeMarshallingMixin,
  // attributes,
  // ClickSelectionMixin,
  // constants,
  // content,
  // ContentItemsMixin,
  // defaultScrollTarget,
  // DefaultSlotContentMixin,
  // Dialog,
  // DirectionSelectionMixin,
  // Drawer,
  // KeyboardDirectionMixin,
  // KeyboardMixin,
  // KeyboardPagedSelectionMixin,
  // KeyboardPrefixSelectionMixin,
  // LabeledTabButton,
  // LabeledTabs,
  ListBox,
  Modes,
  // AlertDialog,
  // OpenCloseMixin,
  // OverlayMixin,
  // Popup,
  // renderArrayAsElements,
  // SelectionAriaMixin,
  // SelectionInViewMixin,
  // ShadowReferencesMixin,
  // ShadowTemplateMixin,
  // SingleSelectionMixin,
  // Symbol,
  // symbols,
  Tabs,
  TabStrip,
  // TabStripWrapper,
  // TransitionEffectMixin,
  // Toast
};


// Create (or add to) Elix global.
window.Elix = Object.assign(window.Elix || {}, Elix);


export default Elix;
