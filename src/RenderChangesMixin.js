import * as symbols from './symbols.js';


const renderCallbacksKey = Symbol('renderCallbacks');


export default function RenderUpdatesMixin(Base) {
  return class RenderUpdates extends Base {

    renderOnChange(dependencies, callback) {
      if (!this[renderCallbacksKey]) {
        this[renderCallbacksKey] = {};
      }
      const array = dependencies instanceof Array ?
        dependencies :
        [dependencies];
      // Register the callback for each dependent state field.
      array.forEach(dependency => {
        if (!this[renderCallbacksKey][dependency]) {
          this[renderCallbacksKey][dependency] = []
        }
        this[renderCallbacksKey][dependency].push(callback);
      });
    }

    [symbols.render](state, changed) {
      if (super[symbols.render]) { super[symbols.render](state, changed); }

      // Give other mixins a chance to do work before updates are applied.
      // this[symbols.beforeUpdate]();

      // Get callbacks for fields that changed.
      const callbacks = [];
      for (const field in changed) {
        const renderCallbacks = this[renderCallbacksKey] || {};
        const callbacksForField = renderCallbacks[field] || [];
        callbacksForField.forEach(callback => {
          // A single callback may be triggered by multiple fields; only add a
          // callback to the list if it's not already there.
          if (!callbacks.includes(callback)) {
            callbacks.push(callback);
          }
        });
      }

      callbacks.forEach(callback => callback(this.state, changed));
    }

  }
}
