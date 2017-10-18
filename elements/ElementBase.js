import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import HostPropsMixin from '../mixins/HostPropsMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';

const ElementBase =
  AttributeMarshallingMixin(
  HostPropsMixin(
  ReactiveMixin(
  ShadowReferencesMixin(
  ShadowTemplateMixin(
    HTMLElement
  )))));

export default ElementBase;
