/*
 * Microtask helper for IE 11.
 *
 * Executing a function as a microtask is trivial in browsers that support
 * promises, whose then() clauses use microtask timing. IE 11 doesn't support
 * promises, but does support MutationObservers, which are also executed as
 * microtasks. So this helper uses an MutationObserver to achieve microtask
 * timing.
 *
 * See https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
 *
 * Inspired by Polymer's async() function.
 */


// The queue of pending callbacks to be executed as microtasks.
const callbacks = [];

// Create an element that we will modify to force observable mutations.
const element = document.createTextNode('');

// A monotonically-increasing value.
let counter = 0;


/**
 * Add a callback to the microtask queue.
 *
 * This uses a MutationObserver so that it works on IE 11.
 *
 * NOTE: IE 11 may actually use timeout timing with MutationObservers. This
 * needs more investigation.
 *
 * @function microtask
 * @param {function} callback
 */
export default function microtask(callback) {
  callbacks.push(callback);
  // Force a mutation.
  element.textContent = ++counter;
}


// Execute any pending callbacks.
function executeCallbacks() {
  while (callbacks.length > 0) {
    const callback = callbacks.shift();
    callback();
  }
}


// Create the observer.
const observer = new MutationObserver(executeCallbacks);
observer.observe(element, {
  characterData: true
});
