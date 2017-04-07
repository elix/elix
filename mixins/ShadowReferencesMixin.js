import symbols from './symbols';


/**
 * This mixin creates references to elements in a component's Shadow DOM subtree.
 *
 * This adds a member on the component called `this.$` that can be used to
 * reference shadow elements with IDs. E.g., if component's shadow contains an
 * element `<button id="foo">`, then this mixin will create a member
 * `this.$.foo` that points to that button.
 *
 * Such references simplify a component's access to its own elements. In
 * exchange, this mixin trades off a one-time cost of querying all elements in
 * the shadow tree instead of paying an ongoing cost to query for an element
 * each time the component wants to inspect or manipulate it.
 *
 * This mixin expects the component to define a Shadow DOM subtree and, when
 * that has been done, to invoke [symbols.shadowCreated](symbols#shadowCreated).
 * You can create the shadow subtree yourself, or make use of
 * [ShadowTemplateMixin](ShadowTemplateMixin).
 *
 * This mixin is inspired by Polymer's [automatic
 * node finding](https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding)
 * feature.
 *
 * @module ShadowReferencesMixin
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function ShadowReferencesMixin(base) {

  class ShadowReferences extends base {

    [symbols.shadowCreated]() {
      if (super[symbols.shadowCreated]) { super[symbols.shadowCreated](); }
      if (this.shadowRoot) {
        // Look for elements in the shadow subtree that have id attributes.
        // An alternatively implementation of this mixin would be to just define
        // a this.$ getter that lazily does this search the first time someone
        // tries to access this.$. That might introduce some complexity – if the
        // the tree changed after it was first populated, the result of
        // searching for a node might be somewhat unpredictable.
        if (!this.$) {
          this.$ = {};
        }
        const nodesWithIds = this.shadowRoot.querySelectorAll('[id]');
        [].forEach.call(nodesWithIds, node => {
          const id = node.getAttribute('id');
          this.$[id] = node;
        });
      }
    }

    /**
     * The collection of references to the elements with IDs in a component's
     * Shadow DOM subtree.
     *
     * @type {object}
     * @member $
     */
  }

  return ShadowReferences;
}
