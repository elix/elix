import { merge } from './updates.js';
import * as symbols from './symbols.js';
import CustomTagsMixin from './CustomTagsMixin.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';


const avatarTagKey = Symbol('avatarTag');
const castKey = Symbol('cast');
const castTagKey = Symbol('castTag');
const previousItemsKey = Symbol('previousItems');
const stageTagKey = Symbol('stageTag');


const Base =
  CustomTagsMixin(
  SingleSelectionMixin(
    ElementBase
  ));


class Spotlight extends Base {

  get avatarTag() {
    return this[avatarTagKey];
  }
  set avatarTag(avatarTag) {
    this[avatarTagKey] = avatarTag;
  }

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
    this[castTagKey] = castTag;
  }

  componentDidMount() {
    const handleSelectedIndexChanged = event => {
      const selectedIndex = event.detail.selectedIndex;
      if (this.selectedIndex !== selectedIndex) {
        this.selectedIndex = selectedIndex;
      }
    };
    this.$.stage.addEventListener('selected-index-changed', handleSelectedIndexChanged);
    this.$.cast.addEventListener('selected-index-changed', handleSelectedIndexChanged);
    this.$.castSlot.addEventListener('slotchange', () => {
      updateDefaultCast(this);
    });
  }

  componentDidUpdate(previousState) {
    if (super.componentDidMount) { super.componentDidMount(); }
    updateDefaultCast(this);
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      castPosition: 'top'
    });
  }

  get items() {
    return this.$.stage.items;
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
    this[stageTagKey] = stageTag;
  }

  get tags() {
    const base = super.tags || {};
    return Object.assign({}, base, {
      stage: 'div',
      cast: 'div'
    });
  }
  set tags(tags) {
    super.tags = tags;
  }

  get [symbols.template]() {
    const stageTag = this.stageTag || this.tags.stage;
    const castTag = this.castTag || this.tags.cast;
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
          selectedIndex
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
  const avatarTag = element.avatarTag || element.tags.avatar;
  if (avatarTag) {
    avatar = document.createElement(avatarTag);
    if (customElements.get(avatarTag)) {
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
      element[castKey] = element.items.map((item, index) =>
        avatarForItem(element, item));
      // Make the array immutable.
      Object.freeze(element[castKey]);
    }
    element[previousItemsKey] = element.items;
  }
  return element[castKey];
}


function updateDefaultCast(element) {
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
