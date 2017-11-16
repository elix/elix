/* Helpers for mocking user interactions in unit tests. */


let hasKeyboardEventConstructor;

/*
 * While real browsers can cope with a try/catch at the top level, Edge can't.
 * We have to wrap this try/catch in an IIFE.
 */
(function () {
  try {
    new window.KeyboardEvent('keydown');
    hasKeyboardEventConstructor = true;
  } catch (e) {
    /* IE 11 */
    hasKeyboardEventConstructor = false;
  }
})();


/**
 * Raise a synthetic keyboard event on the indicated element.
 * The last `init` argument can be left off, in which case an `Enter` key
 * will be simulated.
 */
export function dispatchSyntheticKeyboardEvent(element, eventType, init) {

  const properties = {};
  for (const key in init) {
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

  const properties = Object.assign(
    /* Defaults */
    {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
      button: 0
    },
    init
  );

  const event = new MouseEvent(eventType, properties);
  element.dispatchEvent(event);
}
