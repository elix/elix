import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import ReactiveMixin from './ReactiveMixin.js';
import RenderUpdatesMixin from './RenderUpdatesMixin.js';
import ShadowTemplateMixin from './ShadowTemplateMixin.js';


/**
 * A general-purpose base class for web components.
 * 
 * This class simply bundles a small set of mixins that are useful for creating
 * web components in a functional-reactive programming (FRP) style. It is
 * defined this way:
 *
 *     const ElementBase =
 *       AttributeMarshallingMixin(
 *       ReactiveMixin(
 *       RenderUpdatesMixin(
 *       ShadowTemplateMixin(
 *         HTMLElement
 *       ))));
 *
 * `ElementBase` is simply provided as a convenience, and the same result can be
 * achieved by applying the mixins yourself to `HTMLElement`.
 * 
 * @inherits HTMLElement
 * @mixes AttributeMarshallingMixin
 * @mixes ReactiveMixin
 * @mixes RenderUpdatesMixin
 * @mixes ShadowTemplateMixin
 */
const ElementBase =
  AttributeMarshallingMixin(
  ReactiveMixin(
  RenderUpdatesMixin(
  ShadowTemplateMixin(
    HTMLElement
  ))));

export default ElementBase;
