import FilterListBox from "../base/FilterListBox.js";
import PlainListBoxMixin from "./PlainListBoxMixin.js";

export default class PlainFilterListBox extends PlainListBoxMixin(
  FilterListBox
) {}
