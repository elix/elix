import { replaceChildNodes } from "../core/dom.js";
import * as internal from "./internal.js";
import * as template from "../core/template.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import ListBox from "./ListBox.js";
import Modes from "./Modes.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

// Does a list position imply a lateral arrangement of list and stage?
/** @type {IndexedObject<boolean>} */
const lateralPositions = {
  end: true,
  left: true,
  right: true,
  start: true
};

const Base = LanguageDirectionMixin(
  SingleSelectionMixin(SlotItemsMixin(ReactiveElement))
);

/**
 * Combines a list with an area focusing on a single selected item.
 *
 * @inherits ReactiveElement
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @part {div} proxy - an element representing an item in the list
 * @part {ListBox} proxy-list - the container for the list of proxies
 * @part {Modes} stage - the main element showing a single item from the list
 */
class Explorer extends Base {
  [internal.checkSize]() {
    if (super[internal.checkSize]) {
      super[internal.checkSize]();
    }
    if (this[internal.ids].stage[internal.checkSize]) {
      this[internal.ids].stage[internal.checkSize]();
    }
    if (this[internal.ids].proxyList[internal.checkSize]) {
      this[internal.ids].proxyList[internal.checkSize]();
    }
  }

  [internal.componentDidMount]() {
    super[internal.componentDidMount]();

    // When proxy slot's assigned nodes change, determine whether we need to
    // generate default proxies or (if assigned nodes are present) treat the
    // assigned nodes as the proxies.
    this[internal.ids].proxySlot.addEventListener("slotchange", () => {
      const proxySlot = /** @type {any} */ (this[internal.ids].proxySlot);
      const proxies = proxySlot.assignedNodes({ flatten: true });
      const proxiesAssigned = proxies.length > 0;
      if (proxiesAssigned) {
        // Nodes assigned to slot become proxies.
        this[internal.setState]({
          proxiesAssigned,
          proxies
        });
      } else {
        // No nodes assigned -- we'll need to generate proxies.
        this[internal.setState]({ proxiesAssigned });
      }
    });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxies: [],
      proxiesAssigned: false,
      proxyPartType: "div",
      proxyListOverlap: false,
      proxyListPosition: "top",
      proxyListPartType: ListBox,
      selectionRequired: true,
      stagePartType: Modes
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
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
          this[internal.raiseChangeEvents] = true;
          this.selectedIndex = selectedIndex;
          this[internal.raiseChangeEvents] = false;
        }
      }
    };
    if (changed.proxyListPartType) {
      template.transmute(
        this[internal.ids].proxyList,
        this[internal.state].proxyListPartType
      );
      this[internal.ids].proxyList.addEventListener(
        "selected-index-changed",
        handleSelectedIndexChanged
      );
    }
    if (changed.stagePartType) {
      template.transmute(
        this[internal.ids].stage,
        this[internal.state].stagePartType
      );
      this[internal.ids].stage.addEventListener(
        "selected-index-changed",
        handleSelectedIndexChanged
      );
      this[internal.ids].stage.addEventListener(
        "selection-effect-finished",
        event => {
          const { selectedIndex } = /** @type {any} */ (event).detail;
          /**
           * This event is raised if the current `stage` applies a transition
           * effect when changing the selection, and the selection effect has
           * completed. [CrossfadeStage](CrossfadeStage) applies such an effect,
           * for example.
           *
           * The order of events when the `selectedIndex` property changes is
           * therefore: `selected-index-changed` (occurs immediately when the
           * index changes), followed by `selection-effect-finished` (occurs
           * some time later).
           *
           * @event selection-effect-finished
           */
          const finishedEvent = new CustomEvent("selection-effect-finished", {
            detail: { selectedIndex }
          });
          this.dispatchEvent(finishedEvent);
        }
      );
    }
    const proxyList = this[internal.ids].proxyList;
    const stage = this[internal.ids].stage;
    if (changed.proxies || changed.proxiesAssigned) {
      // Render the default proxies.
      const { proxies, proxiesAssigned } = this[internal.state];
      const childNodes = proxiesAssigned
        ? [this[internal.ids].proxySlot]
        : [this[internal.ids].proxySlot, ...proxies];
      replaceChildNodes(this[internal.ids].proxyList, childNodes);
    }
    if (
      changed.proxyListOverlap ||
      changed.proxyListPosition ||
      changed.proxyListPartType
    ) {
      const { proxyListOverlap, proxyListPosition } = this[internal.state];
      const lateralPosition = lateralPositions[proxyListPosition];
      Object.assign(proxyList.style, {
        height: lateralPosition ? "100%" : null,
        position: proxyListOverlap ? "absolute" : null,
        width: lateralPosition ? null : "100%",
        zIndex: proxyListOverlap ? "1" : null
      });
    }
    if (changed.proxyListPosition || changed.rightToLeft) {
      // Map the relative position of the list vis-a-vis the stage to a position
      // from the perspective of the list.
      const cast = /** @type {any} */ (proxyList);
      if ("position" in cast) {
        const { proxyListPosition, rightToLeft } = this[internal.state];
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
      setListAndStageOrder(this, this[internal.state]);
      const { proxyListPosition } = this[internal.state];
      const lateralPosition = lateralPositions[proxyListPosition];
      this[internal.ids].explorerContainer.style.flexDirection = lateralPosition
        ? "row"
        : "column";
      Object.assign(proxyList.style, {
        bottom: proxyListPosition === "bottom" ? "0" : null,
        left: proxyListPosition === "left" ? "0" : null,
        right: proxyListPosition === "right" ? "0" : null,
        top: proxyListPosition === "top" ? "0" : null
      });
    }
    if (changed.selectedIndex || changed.proxyListPartType) {
      if ("selectedIndex" in proxyList) {
        const { selectedIndex } = this[internal.state];
        /** @type {any} */ (proxyList).selectedIndex = selectedIndex;
      }
    }
    if (changed.selectedIndex || changed.stagePartType) {
      if ("selectedIndex" in stage) {
        const { selectedIndex } = this[internal.state];
        /** @type {any} */ (stage).selectedIndex = selectedIndex;
      }
    }
    if (changed.selectionRequired || changed.proxyListPartType) {
      if ("selectionRequired" in proxyList) {
        const { selectionRequired } = this[internal.state];
        /** @type {any} */ (proxyList).selectionRequired = selectionRequired;
      }
    }
    if (changed.swipeFraction || changed.proxyListPartType) {
      if ("swipeFraction" in proxyList) {
        const { swipeFraction } = this[internal.state];
        /** @type {any} */ (proxyList).swipeFraction = swipeFraction;
      }
    }
    if (changed.swipeFraction || changed.stagePartType) {
      if ("swipeFraction" in stage) {
        const { swipeFraction } = this[internal.state];
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
    return this[internal.state].proxies;
  }

  /**
   * True if the list of proxies should overlap the stage, false if not.
   *
   * @type {boolean}
   * @default false
   */
  get proxyListOverlap() {
    return this[internal.state].proxyListOverlap;
  }
  set proxyListOverlap(proxyListOverlap) {
    const parsed = String(proxyListOverlap) === "true";
    this[internal.setState]({
      proxyListOverlap: parsed
    });
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
    return this[internal.state].proxyListPosition;
  }
  set proxyListPosition(proxyListPosition) {
    this[internal.setState]({ proxyListPosition });
  }

  /**
   * The class, tag, or template used to create the `proxy-list` part - the list
   * of selectable proxies representing the items in the list.
   *
   * @type {PartDescriptor}
   * @default ListBox
   */
  get proxyListPartType() {
    return this[internal.state].proxyListPartType;
  }
  set proxyListPartType(proxyListPartType) {
    this[internal.setState]({ proxyListPartType });
  }

  /**
   * The class, tag, or template used to create the `proxy` parts - the default
   * representations for the list's items.
   *
   * @type {PartDescriptor}
   * @default 'div'
   */
  get proxyPartType() {
    return this[internal.state].proxyPartType;
  }
  set proxyPartType(proxyPartType) {
    this[internal.setState]({ proxyPartType });
  }

  /**
   * The class, tag, or template used for the main "stage" element that shows a
   * single item at a time.
   *
   * @type {PartDescriptor}
   * @default Modes
   */
  get stagePartType() {
    return this[internal.state].stagePartType;
  }
  set stagePartType(stagePartType) {
    this[internal.setState]({ stagePartType });
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // If items for default proxies have changed, recreate the proxies.
    // If nodes have been assigned to the proxy slot, use those instead.
    if (changed.items || changed.proxiesAssigned || changed.proxyPartType) {
      const { items, proxiesAssigned, proxyPartType } = state;
      if ((changed.items || changed.proxyPartType) && !proxiesAssigned) {
        // Generate sufficient default proxies.
        Object.assign(effects, {
          proxies: createDefaultProxies(items, proxyPartType)
        });
      }
    }

    return effects;
  }

  get [internal.template]() {
    return template.html`
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

        [part~="proxy-list"] {
          box-sizing: border-box;
        }

        [part~="stage"] {
          flex: 1;
        }
      </style>
      <div id="explorerContainer" role="none">
        <div id="proxyList" part="proxy-list"><slot id="proxySlot" name="proxy"></slot></div>
        <div id="stage" part="stage" role="none"><slot></slot></div>
      </div>
    `;
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
  const proxies = items
    ? items.map(() => template.createElement(proxyPartType))
    : [];
  proxies.forEach(proxy => {
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
  const container = element[internal.ids].explorerContainer;
  const stage = findChildContainingNode(container, element[internal.ids].stage);
  const list = findChildContainingNode(
    container,
    element[internal.ids].proxyList
  );
  const firstElement = listInInitialPosition ? list : stage;
  const lastElement = listInInitialPosition ? stage : list;
  if (firstElement && lastElement) {
    const nextElementSibling =
      /** @type {any} */ (firstElement).nextElementSibling;
    if (nextElementSibling !== lastElement) {
      element[internal.ids].explorerContainer.insertBefore(
        firstElement,
        lastElement
      );
    }
  }
}

export default Explorer;
