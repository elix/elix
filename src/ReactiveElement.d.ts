// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import ReactiveMixin from './ReactiveMixin.js';
import ShadowTemplateMixin from './ShadowTemplateMixin.js';

export default class ReactiveElement extends
  AttributeMarshallingMixin(
  ReactiveMixin(
  ShadowTemplateMixin(
    HTMLElement
  ))) {}
