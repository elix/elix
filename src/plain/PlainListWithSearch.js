import * as internal from "../base/internal.js";
import ListWithSearch from "../base/ListWithSearch.js";
import PlainFilterListBox from "./PlainFilterListBox.js";
import PlainInput from "./PlainInput.js";

/**
 * ListWithSearch component in the Plain reference design system
 *
 * @inherits ListWithSearch
 * @part {PlainFilterListBox} list
 */
class PlainListWithSearch extends ListWithSearch {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      inputPartType: PlainInput,
      listPartType: PlainFilterListBox
    });
  }
}

export default PlainListWithSearch;
