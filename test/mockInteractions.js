/* Helpers for mocking user interactions in unit tests. */

/**
 * Raise a synthetic keyboard event on the indicated element.
 * The last `init` argument can be left off, in which case an `Enter` key
 * will be simulated.
 */
export function dispatchSyntheticKeyboardEvent(element, eventType, init) {
  const properties = Object.assign(
    {
      bubbles: true,
      key: "Enter",
      keyCode: 13
    },
    init
  );
  properties.which = properties.which || properties.keyCode;
  const event = new window.KeyboardEvent(eventType, properties);
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
