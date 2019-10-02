// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaRoleMixin from './AriaRoleMixin.js';
import ReactiveElement from './ReactiveElement.js';

export default class Backdrop extends AriaRoleMixin(ReactiveElement) {}
