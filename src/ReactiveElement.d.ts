// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AttributeMarshallingMixin from './AttributeMarshallingMixin.js';
import ReactiveMixin from './ReactiveMixin.js';
import ShadowTemplateMixin from './ShadowTemplateMixin.js';

interface HasSymbolsProperties {
  // Define an index signature so we can reference element properties
  // indexed by the Symbols in internal.js -- which we tell TypeScript
  // are strings so that it will support the completely valid use of
  // unique symbols as keys.
  [key: string]: any;
}

export default class ReactiveElement
  extends AttributeMarshallingMixin(
    ReactiveMixin(ShadowTemplateMixin(HTMLElement))
  )
  implements HasSymbolsProperties {
  [key: string]: any;
}
