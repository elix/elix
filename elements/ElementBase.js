import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import PropsMixin from '../mixins/PropsMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';

const ElementBase =
  AttributeMarshallingMixin(
  PropsMixin(
  ReactiveMixin(
  ShadowReferencesMixin(
  ShadowTemplateMixin(
    HTMLElement
  )))));

export default ElementBase
