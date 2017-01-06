/*
 * Polyfill for creating CustomEvents for IE 11.
 * Inspired by https://github.com/krambuhl/custom-event-polyfill.
 */

let customEventConstructor;

function customEventPolyfill(eventName, params) {
  params = params || {
    bubbles: false,
    cancelable: false,
    detail: undefined
  };
  const event = document.createEvent("CustomEvent");
  event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
  const originalPreventDefault = event.preventDefault;
  event.preventDefault = function() {
    originalPreventDefault.call(this);
    try {
      Object.defineProperty(this, 'defaultPrevented', {
        get: function () {
          return true;
        }
      });
    } catch(e) {
      this.defaultPrevented = true;
    }
  };

  return event;
}
Object.setPrototypeOf(customEventPolyfill, window.Event.prototype);

try {
  new window.CustomEvent('test');
  customEventConstructor = window.CustomEvent;
} catch(e) {
  customEventConstructor = customEventPolyfill;
}

export default customEventConstructor;
