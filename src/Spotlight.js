import './Modes.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin';
import SlotContentMixin from './SlotContentMixin.js';


const avatarTagKey = Symbol('avatarTag');
const castKey = Symbol('cast');
const castSlotchangeFiredKey = Symbol('castSlotchangeFired');
const castTagKey = Symbol('castTag');
const previousItemsKey = Symbol('previousItems');
const stageTagKey = Symbol('stageTag');


const Base =
  ContentItemsMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )));


class Spotlight extends Base {

  get avatarTag() {
    return this[avatarTagKey];
  }
  set avatarTag(avatarTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[avatarTagKey] = avatarTag;
  }

  // Return either the assigned cast (if present) or the default cast.
  get cast() {
    /** @type {any} */
    const castSlot = this.$.castSlot;
    const assignedCast = castSlot.assignedNodes({ flatten: true });
    return assignedCast.length > 0 ?
      assignedCast :
      defaultCast(this);
  }

  get castPosition() {
    return this.state.castPosition;
  }
  set castPosition(castPosition) {
    this.setState({ castPosition });
  }

  get castTag() {
    return this[castTagKey];
  }
  set castTag(castTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[castTagKey] = castTag;
  }

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    const handleSelectedIndexChanged = event => {
      this[symbols.raiseChangeEvents] = true;
      const selectedIndex = event.detail.selectedIndex;
      if (this.selectedIndex !== selectedIndex) {
        this.selectedIndex = selectedIndex;
      }
      this[symbols.raiseChangeEvents] = false;
    };
    this.$.stage.addEventListener('selected-index-changed', handleSelectedIndexChanged);
    this.$.cast.addEventListener('selected-index-changed', handleSelectedIndexChanged);

    // Work around inconsistencies in slotchange timing; see SlotContentMixin.
    this.$.castSlot.addEventListener('slotchange', () => {
      this[castSlotchangeFiredKey] = true;
      updateCast(this);
    });
    Promise.resolve().then(() => {
      if (!this[castSlotchangeFiredKey]) {
        // The event didn't fire, so we're most likely in Safari.
        // Update our notion of the component content.
        this[castSlotchangeFiredKey] = true;
        updateCast(this);
      }
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
    updateCast(this);
  }

  get defaults() {
    return {
      tags: {
        avatar: 'div',
        stage: 'elix-modes',
        cast: 'div'
      }
    };
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      castPosition: 'top'
    });
  }

  [symbols.render]() {
    if (super[symbols.render]) { super[symbols.render](); }

    // Physically reorder the cast and stage to reflect the desired arrangement.
    // We could change the visual appearance by reversing the order of the flex
    // box, but then the visual order wouldn't reflect the document order, which
    // determines focus order. That would surprise a user trying to tab through
    // the controls.
    const castPosition = this.state.castPosition;
    const topOrLeftPosition = (castPosition === 'top' || castPosition === 'left');
    const firstElement = topOrLeftPosition ?
      this.$.cast :
      this.$.stage;
    const lastElement = topOrLeftPosition ?
      this.$.stage :
      this.$.cast;
    if (!this.shadowRoot) {
      /* eslint-disable no-console */
      console.warn(`Spotlight expects ${this.constructor.name} to define a shadowRoot.\nThis can be done with ShadowTemplateMixin: https://elix.org/documentation/ShadowTemplateMixin.`);
    } else if (firstElement.nextSibling !== lastElement) {
      this.shadowRoot.insertBefore(firstElement, lastElement);
    }
  }

  setAvatarItem(avatar, item) {
    if ('item' in Object.getPrototypeOf(avatar)) {
      avatar.item = item;
    }
  }

  get stageTag() {
    return this[stageTagKey];
  }
  set stageTag(stageTag) {
    this[symbols.hasDynamicTemplate] = true;
    this[stageTagKey] = stageTag;
  }

  get [symbols.template]() {
    const stageTag = this.stageTag || this.defaults.tags.stage;
    const castTag = this.castTag || this.defaults.tags.cast;
    return `
      <style>
        :host {
          display: inline-flex;
          flex-direction: column;
        }

        #stage {
          flex: 1;
        }
      </style>
      <${stageTag} id="stage">
        <slot></slot>
      </${stageTag}>
      <${castTag} id="cast"><slot id="castSlot" name="cast"></slot></${castTag}>
    `;
  }

  get updates() {
    const castPosition = this.state.castPosition;
    const lateralPosition = castPosition === 'left' || castPosition === 'right';

    const selectedIndex = this.selectedIndex;
    const swipeFraction = this.state.swipeFraction;

    const cast = this.state.cast || [];
    let castChildNodes = [this.$.castSlot, ...cast];

    return merge(super.updates, {
      style: {
        'flex-direction': lateralPosition ? 'row' : 'column'
      },
      $: {
        stage: {
          selectedIndex,
          swipeFraction
        },
        cast: {
          childNodes: castChildNodes,
          position: castPosition,
          selectedIndex,
          swipeFraction
        }
      }
    });
  }

}


// Return true if arrays a and b have the same items.
function arrayEquals(a, b) {
  if ((a && !b) || (!a && b) || (!a && !b) || (a.length !== b.length)) {
    return false;
  }
  return !a.some((item, index) => item !== b[index]);
}


function avatarForItem(element, item) {
  let avatar;
  const avatarTag = element.avatarTag || element.defaults.tags.avatar;
  if (avatarTag) {
    avatar = document.createElement(avatarTag);
    const isCustomElement = avatarTag.indexOf('-') >= 0;
    if (!isCustomElement || customElements.get(avatarTag)) {
      element.setAvatarItem(avatar, item);
    } else {
      customElements.whenDefined(avatarTag)
      .then(() => {
        element.setAvatarItem(avatar, item);
      });
    }
  } else {
    avatar = item.cloneNode(true);
  }
  return avatar;
}


// Return the default cast generated for the given items.
function defaultCast(element) {
  if (element.items !== element[previousItemsKey]) {
    if (!element.items) {
      // No items yet.
      element[castKey] = [];
    } else {
      // Items have changed; create new buttons set.
      element[castKey] = element.items.map(item =>
        avatarForItem(element, item));
      // Make the array immutable.
      Object.freeze(element[castKey]);
    }
    element[previousItemsKey] = element.items;
  }
  return element[castKey];
}


function updateCast(element) {
  /** @type {any} */
  const castSlot = element.$.castSlot;
  const assignedButtons = castSlot.assignedNodes({ flatten: true });
  const cast = assignedButtons.length > 0 ?
    [] :
    defaultCast(element);
  const changed = !arrayEquals(cast, element.state.cast);
  if (changed) {
    element.setState({ cast });
  }
}


customElements.define('elix-spotlight', Spotlight);
export default Spotlight;
