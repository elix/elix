# API Documentation
<a name="microtask"></a>

## microtask(callback)
Add a callback to the microtask queue.

This uses a MutationObserver so that it works on IE 11.

NOTE: IE 11 may actually use timeout timing with MutationObservers. This
needs more investigation.

  **Kind**: global function

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

