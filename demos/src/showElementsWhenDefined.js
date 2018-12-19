/*
 * This module suppresses the display of a page until: 1) all custom elements on
 * a page have had their definitions loaded, or 2) a timeout has elapsed. This
 * is meant to prevent a flash of unstyled content.
 * 
 * To use this, add an 'unresolved' attribute to the document body, along with a
 * style rule that hides the body content when that attribute is present. As it
 * turns out, the web components polyfill provides such styling by default.
 */

export default function showElementsWhenDefined() {

  /* Find all tags for custom elements on the page. */
  const tags = Array.from(
    document.querySelectorAll('*'),
    element => element.localName);
  const customTags = tags.filter(tag => tag.indexOf('-') >= 0);
  const uniqueTags = customTags.filter((item, index) =>
  customTags.indexOf(item) === index);
  
  /* Maps element tag names to `false` (not defined yet) or `true` defined. */
  const elementsDefined = {};
  
  /* Create promises for all custom elements on the page. */
  const promises = uniqueTags.map(tag => {
    elementsDefined[tag] = false;
    return customElements.whenDefined(tag)
    .then(() => {
      elementsDefined[tag] = true;
    });
  });
  
  /* When all elements have been defined, show the page. */
  Promise.all(promises).then(() => showPage());
  
  /*
  * Failsafe: if it takes too long for elements to appear, show the page.
  */
  setTimeout(() => {
    const missingElements = [];
    for (const tag in elementsDefined) {
      if (!elementsDefined[tag]) {
        missingElements.push(tag);
      }
    }
    if (missingElements.length > 0) {
      /* eslint-disable no-console */
      console.warn(`The page may be missing element definitions for: ${missingElements.join(', ')}.`);
      showPage();
    }
  }, 3000);
}

function showPage() {
  if (document.body && document.body.getAttribute('unresolved') !== null) {
    document.body.removeAttribute('unresolved');
  }
}

// @ts-ignore
if (window.WebComponents && !window.WebComponents.ready) {
  // Wait for polyfill.
  window.addEventListener('WebComponentsReady', () => showElementsWhenDefined());
} else if (!document.body) {
  // Wait for document to load.
  window.addEventListener('load', () => showElementsWhenDefined());
} else {
  // Document loaded, can check now.
  showElementsWhenDefined();
}
