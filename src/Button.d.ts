// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

import WrappedStandardElement from './WrappedStandardElement.js';

/**
 * Base class for custom buttons.
 * 
 * `Button` wraps a standard HTML `button` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 * 
 * @inherits WrappedStandardElement
 * @mixes AriaRoleMixin
 * @mixes ComposedFocusMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 */
export default class Button extends WrappedStandardElement {}
