import ChildrenContentMixin from './ChildrenContentMixin.js';
import SlotContentMixin from './SlotContentMixin.js';

export default function ContentCompatMixin(Base) {
  const shadyDOM = window.ShadyDOM && window.ShadyDOM.inUse;
  const nativeShadow = !shadyDOM && 'shadowRoot' in Element.prototype;
  const ContentMixin = nativeShadow ?
    SlotContentMixin :
    ChildrenContentMixin;
  return ContentMixin(Base);
}
