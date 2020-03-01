import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ComposedFocusMixin from "./ComposedFocusMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateItemsMixin from "./DelegateItemsMixin.js";
import DirectionSelectionMixin from "./DirectionSelectionMixin.js";
import FilterListBox from "./FilterListBox.js";
import KeyboardMixin from "./KeyboardMixin.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SelectedItemTextValueMixin from "./SelectedItemTextValueMixin.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";

const Base = ComposedFocusMixin(
  DelegateFocusMixin(
    DelegateItemsMixin(
      DirectionSelectionMixin(
        KeyboardMixin(
          SelectedItemTextValueMixin(SingleSelectionMixin(ReactiveElement))
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
 * @mixes DelegateFocusMixin
 * @mixes DelegateItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SingleSelectionMixin
 * @part {AutoCompleteInput} input - the input element for search terms
 * @part {FilterListBox} list - the searchable list of items
 */
class ListWithSearch extends Base {
  // Forward any ARIA label to the input element.
  get ariaLabel() {
    return this[internal.state].ariaLabel;
  }
  set ariaLabel(ariaLabel) {
    this[internal.setState]({ ariaLabel });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      ariaLabel: "",
      filter: "",
      inputPartType: "input",
      listPartType: FilterListBox,
      placeholder: "Search"
    });
  }

  get filter() {
    return this[internal.state].filter;
  }
  set filter(filter) {
    this[internal.setState]({ filter });
  }

  /**
   * The class, tag, or template used to create the `input` part - the input
   * element in which the user can enter search text.
   *
   * @type {PartDescriptor}
   * @default 'input'
   */
  get inputPartType() {
    return this[internal.state].inputPartType;
  }
  set inputPartType(inputPartType) {
    this[internal.setState]({ inputPartType });
  }

  get [internal.itemsDelegate]() {
    return this[internal.ids].list;
  }

  [internal.keydown](/** @type {KeyboardEvent} */ event) {
    let handled;
    /** @type {any} */
    const list = this[internal.ids].list;

    switch (event.key) {
      // We do our own handling of the Up and Down arrow keys, rather than
      // relying on KeyboardDirectionMixin. The latter supports Home and End,
      // and we don't want to handle those -- we want to let the text input
      // handle them. We also need to forward PageDown/PageUp to the list
      // element.
      case "ArrowDown":
        handled = event.altKey
          ? this[internal.goEnd]()
          : this[internal.goDown]();
        break;
      case "ArrowUp":
        handled = event.altKey
          ? this[internal.goStart]()
          : this[internal.goUp]();
        break;

      // Forward Page Down/Page Up to the list element.
      //
      // This gets a little more complex than we'd like. The pageUp/pageDown
      // methods may update the list's selectedIndex, which in turn will
      // eventually update the selectedIndex of this component. In the meantime,
      // other keydown processing can set state, which will trigger a render.
      // When this component is asked for updates, it'll return the current
      // (i.e. old) selectedIndex value, and overwrite the list's own, newer
      // selectedIndex. To avoid this, we wait for the component to finish
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
            handled = this.selectedIndex < items.length - 1;
          }
        }
        break;
      case "PageUp":
        if (list.pageUp) {
          setTimeout(() => list.pageUp());
          handled = this.selectedIndex > 0;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return (
      handled || (super[internal.keydown] && super[internal.keydown](event))
    );
  }

  /**
   * The class, tag, or template used to create the `list` part - the region
   * that presents the available set of items matching the search criteria.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get listPartType() {
    return this[internal.state].listPartType;
  }
  set listPartType(listPartType) {
    this[internal.setState]({ listPartType });
  }

  get placeholder() {
    return this[internal.state].placeholder;
  }
  set placeholder(placeholder) {
    this[internal.setState]({ placeholder });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.inputPartType) {
      template.transmute(
        this[internal.ids].input,
        this[internal.state].inputPartType
      );
      this[internal.ids].input.addEventListener("input", () => {
        this[internal.raiseChangeEvents] = true;
        const filter = /** @type {any} */ (this[internal.ids].input).value;
        this[internal.setState]({ filter });
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.listPartType) {
      template.transmute(
        this[internal.ids].list,
        this[internal.state].listPartType
      );
    }
    if (changed.ariaLabel) {
      const { ariaLabel } = this[internal.state];
      this[internal.ids].input.setAttribute("aria-label", ariaLabel);
    }
    if (changed.filter) {
      const { filter } = this[internal.state];
      /** @type {HTMLInputElement} */ (this[internal.ids].input).value = filter;
      /** @type {any} */ (this[internal.ids].list).filter = filter;
    }
    if (changed.placeholder) {
      const { placeholder } = this[internal.state];
      /** @type {HTMLInputElement} */ (this[
        internal.ids
      ].input).placeholder = placeholder;
    }
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
        }

        [part~="input"] {
          font: inherit;
        }
      </style>
      <input id="input" part="input">
      <div id="list" part="list" tabindex="-1">
        <slot></slot>
      </div>
    `;
  }
}

export default ListWithSearch;
