import * as internal from "../base/internal.js";
import ListExplorer from "../base/ListExplorer.js";
import PlainListBox from "./ListBox.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainListExplorer extends ListExplorer {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyListPartType: PlainListBox
    });
  }
}

export default PlainListExplorer;
