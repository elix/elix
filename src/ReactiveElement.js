import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import ReactiveMixin from './ReactiveMixin.js';
import RenderUpdatesMixin from './RenderUpdatesMixin.js';
import ShadowTemplateMixin from './ShadowTemplateMixin.js';


/**
 * A general-purpose base class for creating web components in a
 * functional-reactive programming (FRP) style.
 * 
 * This class simply bundles a small set of mixins:
 *
 *     const ReactiveElement =
 *       AttributeMarshallingMixin(
 *       ReactiveMixin(
 *       RenderUpdatesMixin(
 *       ShadowTemplateMixin(
 *         HTMLElement
 *       ))));
 *
 * `ReactiveElement` is simply provided as a convenience, and the same result can be
 * achieved by applying the mixins yourself to `HTMLElement`.
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
