import './StripArrowDirectionButton.js'
import * as symbols from '../../src/symbols.js';
import ArrowDirectionMixin from '../../src/ArrowDirectionMixin.js';
import ClickSelectionMixin from '../../src/ClickSelectionMixin.js';
import DirectionSelectionMixin from '../../src/DirectionSelectionMixin.js';
import FocusVisibleMixin from '../../src/FocusVisibleMixin.js';
import KeyboardDirectionMixin from '../../src/KeyboardDirectionMixin.js';
import KeyboardMixin from '../../src/KeyboardMixin.js';
import SelectionStrip from './SelectionStrip1.js';


const Base =
  ArrowDirectionMixin(
  ClickSelectionMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
    SelectionStrip
  ))))));


class ThumbnailsList extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      overlayArrowButtons: false
    });
  }

  get tags() {
    return Object.assign({}, super.tags, {
      arrowButton: 'strip-arrow-direction-button'
    });
  }
  set tags(tags) {
    super.tags = tags;
  }

  get [symbols.template]() {
    const base = super[symbols.template];
    return this[ArrowDirectionMixin.inject](base);
  }

}


customElements.define('thumbnail-list', ThumbnailsList);
export default ThumbnailsList;
