/* Flush polyfills synchronously for testing purposes. */

export default function() {
  if (window.customElements.flush) {
    window.customElements.flush();
  }
  if (window.ShadyDOM && window.ShadyDOM.inUse) {
    window.ShadyDOM.flush();
  }
}
