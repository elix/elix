import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { transmute } from "../core/template.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import DelegateCursorMixin from "./DelegateCursorMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import FilterListBox from "./FilterListBox.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import {
  defaultState,
  goFirst,
  goLast,
  goNext,
  goPrevious,
  ids,
  inputDelegate,
  itemsDelegate,
  keydown,
  raiseChangeEvents,
  render,
  setState,
  shadowRoot,
  state,
  template,
} from "./internal.js";
import KeyboardMixin from "./KeyboardMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";

const Base = ComposedFocusMixin(
  CursorAPIMixin(
    CursorSelectMixin(
      DelegateCursorMixin(
        DelegateFocusMixin(
          DelegateInputLabelMixin(
            DelegateInputSelectionMixin(
              DelegateItemsMixin(
                FocusVisibleMixin(
                  KeyboardMixin(SingleSelectAPIMixin(ReactiveElement))
                )
              )
            )
          )
        )
      )
    )
  )
);

/**
 * A list accompanied by a search box
 *
 * @inherits ReactiveElement
 * @mixes ComposedFocusMixin
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes DelegateCursorMixin
 * @mixes DelegateFocusMixin
 * @mixes DelegateInputLabelMixin
 * @mixes DelegateInputSelectionMixin
 * @mixes DelegateItemsMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 * @mixes SingleSelectAPIMixin
 * @part {AutoCompleteInput} input - the input element for search terms
 * @part {FilterListBox} list - the searchable list of items
 */
class ListWithSearch extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      filter: "",
      inputPartType: "input",
      listPartType: FilterListBox,
      placeholder: "Search",
    });
  }

  get filter() {
    return this[state].filter;
  }
  set filter(filter) {
    this[setState]({ filter });
  }

  /**
   * The class or tag used to create the `input` part - the input
   * element in which the user can enter search text.
   *
   * @type {PartDescriptor}
   * @default 'input'
   */
  get inputPartType() {
    return this[state].inputPartType;
  }
  set inputPartType(inputPartType) {
    this[setState]({ inputPartType });
  }

  get [inputDelegate]() {
    return this[ids].input;
  }

  get [itemsDelegate]() {
    return this[ids].list;
  }

  [keydown](/** @type {KeyboardEvent} */ event) {
    let handled;
    /** @type {any} */
    const list = this[ids].list;

    switch (event.key) {
      // We do our own handling of the Up and Down arrow keys, rather than
      // relying on KeyboardDirectionMixin. The latter supports Home and End,
      // and we don't want to handle those -- we want to let the text input
      // handle them. We also need to forward PageDown/PageUp to the list
      // element.
      case "ArrowDown":
        handled = event.altKey ? this[goLast]() : this[goNext]();
        break;
      case "ArrowUp":
        handled = event.altKey ? this[goFirst]() : this[goPrevious]();
        break;

      // Forward Page Down/Page Up to the list element.
      //
      // This gets a little more complex than we'd like. The pageUp/pageDown
      // methods may update the list's currentIndex, which in turn will
      // eventually update the currentIndex of this component. In the meantime,
      // other keydown processing can set state, which will trigger a render.
      // When this component is asked for updates, it'll return the current
      // (i.e. old) currentIndex value, and overwrite the list's own, newer
      // currentIndex. To avoid this, we wait for the component to finish
      // processing the keydown using timeout timing, then invoke
      // pageUp/pageDown.
      //
      // This forces us to speculate about whether pageUp/pageDown will update
      // the selection so that we can synchronously return an indication of
      // whether the key event was handled.
      case "PageDown":
        if (list.pageDown) {
          setTimeout(() => list.pageDown());
          const items = this.items;
          if (items) {
            handled = this.currentIndex < items.length - 1;
          }
        }
        break;

      case "PageUp":
        if (list.pageUp) {
          setTimeout(() => list.pageUp());
          handled = this.currentIndex > 0;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[keydown] && super[keydown](event));
  }

  /**
   * The class or tag used to create the `list` part - the region
   * that presents the available set of items matching the search criteria.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get listPartType() {
    return this[state].listPartType;
  }
  set listPartType(listPartType) {
    this[setState]({ listPartType });
  }

  get placeholder() {
    return this[state].placeholder;
  }
  set placeholder(placeholder) {
    this[setState]({ placeholder });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.inputPartType) {
      this[ids].input.addEventListener("input", () => {
        this[raiseChangeEvents] = true;
        const filter = /** @type {any} */ (this[ids].input).value;
        this[setState]({ filter });
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.filter) {
      const { filter } = this[state];
      /** @type {HTMLInputElement} */ (this[ids].input).value = filter;
      /** @type {any} */ (this[ids].list).filter = filter;
    }

    if (changed.placeholder) {
      const { placeholder } = this[state];
      /** @type {HTMLInputElement} */ (this[ids]
        .input).placeholder = placeholder;
    }
  }

  get [template]() {
    const result = super[template];

    result.content.append(fragmentFrom.html`
      <style>
        :host {
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
        }

        [part~=input] {
          outline: none;
        }

        [part~=list] {
          outline: none;
        }
      </style>
      <input id="input" part="input" />
      <div id="list" part="list" tabindex="-1">
        <slot></slot>
      </div>
    `);

    renderParts(result.content, this[state]);

    return result;
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.inputPartType) {
    const { inputPartType } = state;
    const input = root.getElementById("input");
    if (input) {
      transmute(input, inputPartType);
    }
  }
  if (!changed || changed.listPartType) {
    const { listPartType } = state;
    const list = root.getElementById("list");
    if (list) {
      transmute(list, listPartType);
    }
  }
}

export default ListWithSearch;
