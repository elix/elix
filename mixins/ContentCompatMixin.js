import ChildrenContentMixin from './ChildrenContentMixin.js';
import DefaultSlotContentMixin from './DefaultSlotContentMixin.js';

export default function ContentCompatMixin(Base) {
  const shadyDOM = window.ShadyDOM && window.ShadyDOM.inUse;
  const nativeShadow = !shadyDOM && 'shadowRoot' in Element.prototype;
  const ContentMixin = nativeShadow ?
    DefaultSlotContentMixin :
    ChildrenContentMixin;
  return ContentMixin(Base);
}
