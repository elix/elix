// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import AriaRoleMixin from "./AriaRoleMixin.js";
import CurrentMixin from "./CurrentMixin.js";
import DisabledMixin from "./DisabledMixin.js";
import SelectableMixin from "./SelectableMixin.js";

export default class Option extends AriaRoleMixin(
  CurrentMixin(DisabledMixin(SelectableMixin(ReactiveElement)))
) {}
