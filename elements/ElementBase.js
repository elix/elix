import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import PropsMixin from '../mixins/PropsMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';

const ElementBase =
  AttributeMarshallingMixin(
  PropsMixin(
  ReactiveMixin(
  ShadowTemplateMixin(
    HTMLElement
  ))));

export default ElementBase
