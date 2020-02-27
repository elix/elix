import ReactiveElement from "../core/ReactiveElement.js";
import SelectableMixin from "./SelectableMixin.js";

/**
 * A choice in a menu
 *
 * This class is a convenient way to popuplate a [Menu](Menu) with items that
 * exhibit an appearance roughly consistent with operating system menu items.
 * Use of this class is not required, however -- a `Menu` can contain any type
 * of item you want.
 *
 * @inherits ReactiveElement
 * @mixes SelectableMixin
 */
class MenuItem extends SelectableMixin(ReactiveElement) {}

export default MenuItem;
