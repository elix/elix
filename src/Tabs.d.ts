// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Explorer from './Explorer.js';
import GenericMixin from './GenericMixin.js';

export default class Tabs extends GenericMixin(Explorer) {
  tabAlign: 'start' | 'center' | 'end' | 'stretch';
}
