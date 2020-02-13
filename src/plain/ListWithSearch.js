import * as internal from "../base/internal.js";
import ListWithSearch from "../base/ListWithSearch.js";
import PlainFilterListBox from "./FilterListBox.js";

class PlainListWithSearch extends ListWithSearch {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      listPartType: PlainFilterListBox
    });
  }
}

export default PlainListWithSearch;
