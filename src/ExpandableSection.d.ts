// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaRoleMixin from './AriaRoleMixin.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';

export default class ExpandableSection extends AriaRoleMixin(
  OpenCloseMixin(ReactiveElement)
) {
  headerPartType: PartDescriptor;
  panelPartType: PartDescriptor;
}
