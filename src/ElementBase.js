import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import ReactiveMixin from './ReactiveMixin.js';
import RenderUpdatesMixin from './RenderUpdatesMixin.js';
import ShadowTemplateMixin from './ShadowTemplateMixin.js';

const ElementBase =
  AttributeMarshallingMixin(
  ReactiveMixin(
  RenderUpdatesMixin(
  ShadowTemplateMixin(
    HTMLElement
  ))));

export default ElementBase
