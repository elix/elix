import { updateChildNodes } from "../core/dom.js";
import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import { createElement, transmute } from "../core/template.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import {
  checkSize,
  closestAvailableItemIndex,
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ListBox from "./ListBox.js";
import Modes from "./Modes.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

// Does a list position imply a lateral arrangement of list and stage?
/** @type {IndexedObject<boolean>} */
const lateralPositions = {
  end: true,
  left: true,
  right: true,
  start: true,
};

const Base = CursorAPIMixin(
  CursorSelectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        LanguageDirectionMixin(
          SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement))
        )
      )
    )
  )
);

/**
 * Combines a list with an area focusing on a single selected item.
 *
 * @inherits ReactiveElement
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes ItemsCursorMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @part {div} proxy - an element representing an item in the list
 * @part {ListBox} proxy-list - the container for the list of proxies
 * @part {Modes} stage - the main element showing a single item from the list
 */
class Explorer extends Base {
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "proxy-list-overlap") {
      this.proxyListOverlap = String(newValue) === "true";
    } else {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  /**
   * True if the item cursor can be moved to the next item, false if not (the
   * current item is the last item in the list).
   *
   * @type {boolean}
   */
  get canGoNext() {
    return this[state].canGoNext;
  }

  /**
   * True if the item cursor can be moved to the previous item, false if not
   * (the current item is the first one in the list).
   *
   * @type {boolean}
   */
  get canGoPrevious() {
    return this[state].canGoPrevious;
  }

  [checkSize]() {
    if (super[checkSize]) {
      super[checkSize]();
    }
    if (this[ids].stage[checkSize]) {
      this[ids].stage[checkSize]();
    }
    if (this[ids].proxyList[checkSize]) {
      this[ids].proxyList[checkSize]();
    }
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
      proxies: [],
      proxiesAssigned: false,
      proxyListOverlap: false,
      proxyListPartType: ListBox,
      proxyListPosition: "top",
      proxyPartType: "div",
      stagePartType: Modes,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      // When proxy slot's assigned nodes change, determine whether we need to
      // generate default proxies or (if assigned nodes are present) treat the
      // assigned nodes as the proxies.
      this[ids].proxySlot.addEventListener("slotchange", () => {
        const proxySlot = /** @type {any} */ (this[ids].proxySlot);
        const proxies = proxySlot.assignedNodes({ flatten: true });
        const proxiesAssigned = proxies.length > 0;
        if (proxiesAssigned) {
          // Nodes assigned to slot become proxies.
          this[setState]({
            proxiesAssigned,
            proxies,
          });
        } else {
          // No nodes assigned -- we'll need to generate proxies.
          this[setState]({ proxiesAssigned });
        }
      });
    }

    /** @type {any} */
    const handleSelectedIndexChanged = (/** @type {CustomEvent} */ event) => {
      // The proxy list and stage may raise events before they've actually
      // had a chance to sync up their items to reflect the current state
      // of the explorer component, so we only handle their events if
      // their count of items matches ours.
      /** @type {any} */ const cast = event.target;
      if (cast && this.items.length === cast.items.length) {
        const selectedIndex = event.detail.selectedIndex;
        if (this.selectedIndex !== selectedIndex) {
          this[raiseChangeEvents] = true;
          this.selectedIndex = selectedIndex;
          this[raiseChangeEvents] = false;
        }
      }
    };

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.proxyListPartType) {
      this[ids].proxyList.addEventListener(
        "selectedindexchange",
        handleSelectedIndexChanged
      );
    }

    if (changed.stagePartType) {
      this[ids].stage.addEventListener(
        "selectedindexchange",
        handleSelectedIndexChanged
      );
      this[ids].stage.addEventListener("selectioneffectend", (event) => {
        const { selectedIndex } = /** @type {any} */ (event).detail;
        const oldEvent = new CustomEvent("selection-effect-finished", {
          bubbles: true,
          detail: { selectedIndex },
        });
        this.dispatchEvent(oldEvent);
        /**
         * This event is raised if the current `stage` applies a transition
         * effect when changing the selection, and the selection effect has
         * completed. [CrossfadeStage](CrossfadeStage) applies such an effect,
         * for example.
         *
         * The order of events when the `selectedIndex` property changes is
         * therefore: `selectedindexchange` (occurs immediately when the index
         * changes), followed by `selectioneffectend` (occurs some time later).
         *
         * @event selectioneffectend
         */
        const selectedEffectEndEvent = new CustomEvent("selectioneffectend", {
          bubbles: true,
          detail: { selectedIndex },
        });
        this.dispatchEvent(selectedEffectEndEvent);
      });
    }

    const proxyList = this[ids].proxyList;
    const stage = this[ids].stage;
    if (changed.proxies || changed.proxiesAssigned) {
      // Render the default proxies.
      const { proxies, proxiesAssigned } = this[state];
      const childNodes = proxiesAssigned
        ? [this[ids].proxySlot]
        : [this[ids].proxySlot, ...proxies];
      updateChildNodes(this[ids].proxyList, childNodes);
    }

    if (
      changed.proxyListOverlap ||
      changed.proxyListPosition ||
      changed.proxyListPartType
    ) {
      const { proxyListOverlap, proxyListPosition } = this[state];
      const lateralPosition = lateralPositions[proxyListPosition];
      Object.assign(proxyList.style, {
        height: lateralPosition ? "100%" : null,
        position: proxyListOverlap ? "absolute" : null,
        width: lateralPosition ? null : "100%",
        zIndex: proxyListOverlap ? "1" : null,
      });
    }

    if (changed.proxyListPosition || changed.rightToLeft) {
      // Map the relative position of the list vis-a-vis the stage to a position
      // from the perspective of the list.
      const cast = /** @type {any} */ (proxyList);
      if ("position" in cast) {
        const { proxyListPosition, rightToLeft } = this[state];
        let position;
        switch (proxyListPosition) {
          case "end":
            position = rightToLeft ? "left" : "right";
            break;
          case "start":
            position = rightToLeft ? "right" : "left";
            break;
          default:
            position = proxyListPosition;
            break;
        }
        cast.position = position;
      }
    }

    if (changed.proxyListPosition || changed.proxyListPartType) {
      setListAndStageOrder(this, this[state]);
      const { proxyListPosition } = this[state];
      const lateralPosition = lateralPositions[proxyListPosition];
      this[ids].explorerContainer.style.flexDirection = lateralPosition
        ? "row"
        : "column";
      Object.assign(proxyList.style, {
        bottom: proxyListPosition === "bottom" ? "0" : null,
        left: proxyListPosition === "left" ? "0" : null,
        right: proxyListPosition === "right" ? "0" : null,
        top: proxyListPosition === "top" ? "0" : null,
      });
    }

    if (changed.currentIndex || changed.proxyListPartType) {
      if ("selectedIndex" in proxyList) {
        const { currentIndex } = this[state];
        /** @type {any} */ (proxyList).selectedIndex = currentIndex;
      }
    }

    if (changed.currentIndex || changed.stagePartType) {
      if ("selectedIndex" in stage) {
        const { currentIndex } = this[state];
        /** @type {any} */ (stage).selectedIndex = currentIndex;
      }
    }

    if (changed.currentItemRequired || changed.proxyListPartType) {
      if ("selectionRequired" in proxyList) {
        const { selectionRequired } = this[state];
        /** @type {any} */ (proxyList).selectionRequired = selectionRequired;
      }
    }

    if (changed.swipeFraction || changed.proxyListPartType) {
      if ("swipeFraction" in proxyList) {
        const { swipeFraction } = this[state];
        /** @type {any} */ (proxyList).swipeFraction = swipeFraction;
      }
    }

    if (changed.swipeFraction || changed.stagePartType) {
      if ("swipeFraction" in stage) {
        const { swipeFraction } = this[state];
        /** @type {any} */ (stage).swipeFraction = swipeFraction;
      }
    }
  }

  /**
   * The current set of proxy elements that correspond to the component's
   * main `items`. If you have assigned elements to the `proxy` slot, this
   * returns the collection of those elements. Otherwise, this will return
   * a collection of default proxies generated by the component, one for
   * each item.
   *
   * @type {Element[]}
   */
  get proxies() {
    return this[state].proxies;
  }

  /**
   * True if the list of proxies should overlap the stage, false if not.
   *
   * @type {boolean}
   * @default false
   */
  get proxyListOverlap() {
    return this[state].proxyListOverlap;
  }
  set proxyListOverlap(proxyListOverlap) {
    this[setState]({ proxyListOverlap });
  }

  /**
   * The position of the proxy list relative to the stage.
   *
   * The `start` and `end` values refer to text direction: in left-to-right
   * languages such as English, these are equivalent to `left` and `right`,
   * respectively.
   *
   * @type {('bottom'|'end'|'left'|'right'|'start'|'top')}
   * @default 'start'
   */
  get proxyListPosition() {
    return this[state].proxyListPosition;
  }
  set proxyListPosition(proxyListPosition) {
    this[setState]({ proxyListPosition });
  }

  /**
   * The class or tag used to create the `proxy-list` part - the list
   * of selectable proxies representing the items in the list.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get proxyListPartType() {
    return this[state].proxyListPartType;
  }
  set proxyListPartType(proxyListPartType) {
    this[setState]({ proxyListPartType });
  }

  /**
   * The class or tag used to create the `proxy` parts - the default
   * representations for the list's items.
   *
   * @type {PartDescriptor}
   * @default 'div'
   */
  get proxyPartType() {
    return this[state].proxyPartType;
  }
  set proxyPartType(proxyPartType) {
    this[setState]({ proxyPartType });
  }

  /**
   * The class or tag used for the main "stage" element that shows a
   * single item at a time.
   *
   * @type {PartDescriptor}
   * @default Modes
   */
  get stagePartType() {
    return this[state].stagePartType;
  }
  set stagePartType(stagePartType) {
    this[setState]({ stagePartType });
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // If items for default proxies have changed, recreate the proxies.
    // If nodes have been assigned to the proxy slot, use those instead.
    if (changed.items || changed.proxiesAssigned || changed.proxyPartType) {
      const { items, proxiesAssigned, proxyPartType } = state;
      if ((changed.items || changed.proxyPartType) && !proxiesAssigned) {
        // Generate sufficient default proxies.
        Object.assign(effects, {
          proxies: createDefaultProxies(items, proxyPartType),
        });
      }
    }

    // Update computed state members canGoNext/canGoPrevious.
    if (
      changed.currentIndex ||
      changed.cursorOperationsWrap ||
      changed.filter ||
      changed.items
    ) {
      const { currentIndex, items } = state;
      // Can go next/previous if there are items but no cursor.
      const specialCase = items && items.length > 0 && currentIndex < 0;
      const canGoNext =
        specialCase ||
        this[closestAvailableItemIndex](state, {
          direction: 1,
          index: currentIndex + 1,
        }) >= 0;
      const canGoPrevious =
        specialCase ||
        this[closestAvailableItemIndex](state, {
          direction: -1,
          index: currentIndex - 1,
        }) >= 0;
      Object.assign(effects, {
        canGoNext,
        canGoPrevious,
      });
    }

    return effects;
  }

  get [template]() {
    const result = templateFrom.html`
      <style>
        :host {
          display: inline-flex;
        }
        
        #explorerContainer {
          display: flex;
          flex: 1;
          max-width: 100%; /* For Firefox */
          position: relative;
        }

        [part~=proxy-list] {
          box-sizing: border-box;
        }

        [part~=stage] {
          flex: 1;
        }
      </style>
      <div id="explorerContainer" role="none">
        <div id="proxyList" part="proxy-list"><slot id="proxySlot" name="proxy"></slot></div>
        <div id="stage" part="stage" role="none"><slot></slot></div>
      </div>
    `;

    renderParts(result.content, this[state]);

    return result;
  }
}

/**
 * Return the default list generated for the given items.
 *
 * @private
 * @param {ListItemElement[]} items
 * @param {PartDescriptor} proxyPartType
 */
function createDefaultProxies(items, proxyPartType) {
  const proxies = items ? items.map(() => createElement(proxyPartType)) : [];
  proxies.forEach((proxy) => {
    // As of February 2020, the `part` property is not available in all
    // browsers, so we set it as an attribute instead.
    /** @type {any} */ (proxy).setAttribute("part", "proxy");
  });
  // Make the array immutable to avoid accidental mutation.
  Object.freeze(proxies);
  return proxies;
}

/**
 * Find the child of root that is or contains the given node.
 *
 * @private
 * @param {Node} root
 * @param {Node} node
 * @returns {Node|null}
 */
function findChildContainingNode(root, node) {
  const parentNode = node.parentNode;
  return parentNode === root
    ? node
    : parentNode
    ? findChildContainingNode(root, parentNode)
    : null;
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
  if (!changed || changed.proxyListPartType) {
    const proxyList = root.getElementById("proxyList");
    if (proxyList) {
      const { proxyListPartType } = state;
      transmute(proxyList, proxyListPartType);
    }
  }
  if (!changed || changed.stagePartType) {
    const stage = root.getElementById("stage");
    if (stage) {
      const { stagePartType } = state;
      transmute(stage, stagePartType);
    }
  }
}

/**
 * Physically reorder the list and stage to reflect the desired arrangement. We
 * could change the visual appearance by reversing the order of the flex box,
 * but then the visual order wouldn't reflect the document order, which
 * determines focus order. That would surprise a user trying to tab through the
 * controls.
 *
 * @private
 * @param {Explorer} element
 * @param {PlainObject} state
 */
function setListAndStageOrder(element, state) {
  const { proxyListPosition, rightToLeft } = state;
  const listInInitialPosition =
    proxyListPosition === "top" ||
    proxyListPosition === "start" ||
    (proxyListPosition === "left" && !rightToLeft) ||
    (proxyListPosition === "right" && rightToLeft);
  const container = element[ids].explorerContainer;
  const stage = findChildContainingNode(container, element[ids].stage);
  const list = findChildContainingNode(container, element[ids].proxyList);
  const firstElement = listInInitialPosition ? list : stage;
  const lastElement = listInInitialPosition ? stage : list;
  if (firstElement && lastElement) {
    const nextElementSibling = /** @type {any} */ (firstElement)
      .nextElementSibling;
    if (nextElementSibling !== lastElement) {
      element[ids].explorerContainer.insertBefore(firstElement, lastElement);
    }
  }
}

export default Explorer;
