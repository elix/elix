import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import RenderPropsMixin from '../mixins/RenderPropsMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';

const ElementBase =
  AttributeMarshallingMixin(
  ReactiveMixin(
  RenderPropsMixin(
  ShadowReferencesMixin(
  ShadowTemplateMixin(
    HTMLElement
  )))));

export default ElementBase
