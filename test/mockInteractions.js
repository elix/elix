/* Helpers for mocking user interactions in unit tests. */


let hasKeyboardEventConstructor;

try {
  new window.KeyboardEvent('keydown');
  hasKeyboardEventConstructor = true;
} catch (e) {
  /* IE 11 */
  hasKeyboardEventConstructor = false;
}


/**
 * Raise a synthetic keyboard event on the indicated element.
 * The last `init` argument can be left off, in which case an `Enter` key
 * will be simulated.
 */
export function dispatchSyntheticKeyboardEvent(element, eventType, init) {

  const properties = {};
  for (let key in init) {
    properties[key] = init[key];
  }
  properties.key = properties.key || 'Enter';
  properties.keyCode = properties.keyCode || 13;
  properties.which = properties.which || properties.keyCode;

  let event;
  if (hasKeyboardEventConstructor) {
    event = new window.KeyboardEvent(eventType, properties);
  } else {
    event = document.createEvent('KeyboardEvent');
    event.initKeyboardEvent(
      eventType,
      true,             // bubbles
      true,             // cancelable
      window,           // view
      properties.key,   // key
      0,                // location
      '',               // modifiers
      false,            // repeat
      ''                // locale
    );
  }

  // Note: in IE 11, the code below sets the `key` property, but does *not*
  // appear to set the `keyCode` property.
  Object.defineProperties(event, {
    key: { value: properties.key },
    keyCode: { value: properties.keyCode },
    which: { value: properties.which }
  });

  element.dispatchEvent(event);
}


/**
 * Raise a synthetic mousedown event on the indicated element.
 */
export function dispatchSyntheticMouseEvent(element, eventType, init) {

  const properties = {};
  for (let key in init) {
    properties[key] = init[key];
  }
  properties.bubbles = properties.bubbles || true;
  properties.cancelable = properties.cancelable || true;
  properties.clientX = properties.clientX || 0;
  properties.clientY = properties.clientY || 0;
  properties.button = properties.button || 0;

  const event = new MouseEvent(eventType, properties);
  element.dispatchEvent(event);
}
