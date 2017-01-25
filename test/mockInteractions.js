/* Helpers for mocking user interactions in unit tests. */


let hasMouseEventConstructor;
try {
  new MouseEvent('click');
  hasMouseEventConstructor = true;
} catch (e) {
  /* IE 11 */
  hasMouseEventConstructor = false;
}


/**
 * Raise a synthetic mousedown event on the indicated element.
 */
export function dispatchSyntheticMouseEvent(element, eventType) {
  let event;
  if (hasMouseEventConstructor) {
    event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
      buttons: 1
    });
  } else {
    event = document.createEvent('MouseEvent');
    event.initMouseEvent(
      eventType,
      true, /* bubbles */
      true, /* cancelable */
      null, /* view */
      null, /* detail */
      0,    /* screenX */
      0,    /* screenY */
      0,    /* clientX */
      0,    /* clientY */
      false, /*ctrlKey */
      false, /*altKey */
      false, /*shiftKey */
      false, /*metaKey */
      0,     /*button */
      null   /*relatedTarget*/
    );
  }
  element.dispatchEvent(event);
}
