import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import RenderUpdatesMixin from '../mixins/RenderUpdatesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';

const ElementBase =
  AttributeMarshallingMixin(
  ReactiveMixin(
  RenderUpdatesMixin(
  ShadowTemplateMixin(
    HTMLElement
  ))));

export default ElementBase
