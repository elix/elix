/**
 * Mixin which adds a simplistic means of cloning a string template into a new
 * shadow root.
 *
 * @module SimpleTemplateMixin
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function SimpleTemplateMixin(base) {

  /**
   * The class prototype added by the mixin.
   */
  class SimpleTemplate extends base {

    constructor() {
	    super();
	    const template = this.template;
	    if (template) {
        const root = this.attachShadow({ mode: 'open' });
        root.innerHTML = template;
	    }
    }

    /**
     * Set/unset the class with the indicated name.
     *
     * This method exists primarily to handle the case where an element wants to
     * set a default property value that should be reflected as as class. An
     * important limitation of custom element consturctors is that they cannot
     * set attributes, including the `class` attribute. A call to
     * `reflectClass` during the constructor will be deferred until the element
     * is connected to the document.
     *
     * @param {string} className - The name of the class to set.
     * @param {object} value - True to set the class, false to remove it.
     */
    reflectClass(className, value) {
      // For documentation purposes only
    }

  }

  return SimpleTemplate;
}
