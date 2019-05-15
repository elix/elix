import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import OriginalAttributesMixin from './OriginalAttributesMixin.js';
import PopulateUpdateMixin from './PopulateUpdateMixin.js';
import ReactiveMixin from './ReactiveMixin.js';
import ShadowTemplateMixin from './ShadowTemplateMixin.js';


/**
 * General-purpose base for writing components in functional-reactive style
 * 
 * This base class lets you create web components in a functional-reactive
 * programming (FRP) style. It simply bundles a small set of mixins:
 *
 *     const ReactiveElement =
 *       AttributeMarshallingMixin(
 *       OriginalAttributesMixin(
 *       ReactiveMixin(
 *       PopulateUpdateMixin(
 *       ShadowTemplateMixin(
 *         HTMLElement
 *       )))));
 *
 * `ReactiveElement` is provided as a convenience. You can achieve the same
 * result by applying the mixins yourself to `HTMLElement`.
 * 
 * @inherits HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ReactiveMixin
 * @mixes OriginalAttributesMixin
 * @mixes PopulateUpdateMixin
 * @mixes ShadowTemplateMixin
 */
const ReactiveElement =
  AttributeMarshallingMixin(
  OriginalAttributesMixin(
  ReactiveMixin(
  PopulateUpdateMixin(
  ShadowTemplateMixin(
    HTMLElement
  )))));

export default ReactiveElement;
