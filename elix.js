/*
 * The complete set of Elix elements.
 * 
 * This is primarily used during testing, as it causes all Elix's elements and
 * mixins to be loaded/built. Generally, you can ignore this file, and import
 * the source file(s) you want from the src folder.
 */


 // Import mixins
import * as content from './mixins/content.js';
import AttributeMarshallingMixin from './mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from './mixins/ClickSelectionMixin.js';
import constants from './mixins/constants.js';
import ContentItemsMixin from './mixins/ContentItemsMixin.js';
import defaultScrollTarget from './mixins/defaultScrollTarget.js';
import DirectionSelectionMixin from './mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from './mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from './mixins/KeyboardMixin.js';
import KeyboardPagedSelectionMixin from './mixins/KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from './mixins/KeyboardPrefixSelectionMixin.js';
import OpenCloseTransitionMixin from './mixins/OpenCloseTransitionMixin.js';
import OverlayMixin from './mixins/OverlayMixin.js';
import SelectionAriaMixin from './mixins/SelectionAriaMixin.js';
import SelectionInViewMixin from './mixins/SelectionInViewMixin.js';
import ShadowReferencesMixin from './mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from './mixins/ShadowTemplateMixin.js';
import SingleSelectionMixin from './mixins/SingleSelectionMixin.js';
import SlotContentMixin from './mixins/SlotContentMixin.js';
import Symbol from './mixins/Symbol.js';
import symbols from './mixins/symbols.js';

// Import elements
// import AlertDialog from './elements/AlertDialog.js';
import Dialog from './elements/Dialog.js';
import Drawer from './elements/Drawer.js';
import ListBox from './elements/ListBox.js';
import Modes from './elements/Modes.js';
// import Popup from './elements/Popup.js';
import Spread from './elements/Spread.js';
import TabButton from './elements/TabButton.js';
import Tabs from './elements/Tabs.js';
import TabStrip from './elements/TabStrip.js';
// import Toast from './elements/Toast.js';


// The complete list of all mixins and elements.
export default {
  // AlertDialog,
  // Popup,
  // Toast
  AttributeMarshallingMixin,
  ClickSelectionMixin,
  constants,
  content,
  ContentItemsMixin,
  defaultScrollTarget,
  Dialog,
  DirectionSelectionMixin,
  Drawer,
  KeyboardDirectionMixin,
  KeyboardMixin,
  KeyboardPagedSelectionMixin,
  KeyboardPrefixSelectionMixin,
  ListBox,
  Modes,
  OpenCloseTransitionMixin,
  OverlayMixin,
  SelectionAriaMixin,
  SelectionInViewMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin,
  SingleSelectionMixin,
  SlotContentMixin,
  Spread,
  Symbol,
  symbols,
  TabButton,
  Tabs,
  TabStrip
};
