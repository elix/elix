import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import ExplicitAttributesMixin from './ExplicitAttributesMixin.js';
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
 *       ExplicitAttributesMixin(
 *       PopulateUpdateMixin(
 *       ReactiveMixin(
 *       ShadowTemplateMixin(
 *         HTMLElement
 *       )))));
 *
 * `ReactiveElement` is provided as a convenience. You can achieve the same
 * result by applying the mixins yourself to `HTMLElement`.
 * 
 * @inherits HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ExplicitAttributesMixin
 * @mixes PopulateUpdateMixin
 * @mixes ReactiveMixin
 * @mixes ShadowTemplateMixin
 */
const ReactiveElement =
  AttributeMarshallingMixin(
  ExplicitAttributesMixin(
  PopulateUpdateMixin(
  ReactiveMixin(
  ShadowTemplateMixin(
    HTMLElement
  )))));

export default ReactiveElement;
