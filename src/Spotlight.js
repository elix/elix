import { merge } from './updates.js';
import * as symbols from './symbols.js';
import CustomTagsMixin from './CustomTagsMixin.js';
import ElementBase from './ElementBase.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';


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

  get cast() {
    /** @type {any} */
    const castSlot = this.$.castSlot;
    const assignedCast = castSlot.assignedNodes({ flatten: true });
    return assignedCast.length > 0 ?
      assignedCast :
      defaultCast(this);
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

  get items() {
    return this.$.stage.items;
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
    const selectedIndex = this.selectedIndex;
    const swipeFraction = this.state.swipeFraction;

    const cast = this.state.cast || [];
    let castChildNodes = [this.$.castSlot, ...cast];

    return merge(super.updates, {
      $: {
        stage: {
          selectedIndex,
          swipeFraction
        },
        cast: {
          childNodes: castChildNodes,
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
  const avatarTag = element.tags.avatar;
  if (avatarTag) {
    avatar = document.createElement(avatarTag);
    customElements.whenDefined(avatarTag)
    .then(() => {
      if ('item' in Object.getPrototypeOf(avatar)) {
        avatar.item = item;
      }
    });
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
