import * as symbols from './symbols.js';


/**
 * Defines rendering in two steps: 1) populating a shadow root, and 2) updating
 * the top-level element and the elements in its shadow tree.
 * 
 * @module PopulateUpdateMixin
 */
function PopulateUpdateMixin(Base) {

  class PopulateUpdate extends Base {

    [symbols.render](changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }

      // Invoke any internal popuplate implementations.
      this[symbols.populate](changed);

      // Let the component and its mixins update the element and its shadow.
      this[symbols.update](changed);
    }

    /*
     * Internal populate method.
     * 
     * The default implementation does nothing. Augment this in your component
     * (or another mixin) to populate your component's shadow tree.
     */
    [symbols.populate](changed) {
      if (super[symbols.populate]) { super[symbols.populate](changed); }
    }

    /*
     * Internal update method.
     * 
     * The default implementation does nothing. Augment this in your component
     * (or another mixin) to update the component's top-level element and its
     * shadow elements.
     */
    [symbols.update](changed) {
      if (super[symbols.update]) { super[symbols.update](changed); }
    }

  }

  return PopulateUpdate;
}


export default PopulateUpdateMixin;
