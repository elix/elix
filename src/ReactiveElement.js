import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import ReactiveMixin from './ReactiveMixin.js';
import RenderUpdatesMixin from './RenderUpdatesMixin.js';
import ShadowTemplateMixin from './ShadowTemplateMixin.js';


/**
 * General-purpose component base class
 * 
 * This base class lets you create web components in a functional-reactive
 * programming (FRP) style. It simply bundles a small set of mixins:
 *
 *     const ReactiveElement =
 *       AttributeMarshallingMixin(
 *       ReactiveMixin(
 *       RenderUpdatesMixin(
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
 * @mixes RenderUpdatesMixin
 * @mixes ShadowTemplateMixin
 */
const ReactiveElement =
  AttributeMarshallingMixin(
  ReactiveMixin(
  RenderUpdatesMixin(
  ShadowTemplateMixin(
    HTMLElement
  ))));

export default ReactiveElement;
