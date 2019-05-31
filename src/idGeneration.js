let generatedIdCount = 0;

const generatedIdKey = Symbol('generatedId');


/**
 * If the given element already has an ID, return it. If not, generate a
 * previously unused ID and return that.
 * 
 * @param {Element} element 
 * @returns {string}
 */
export function ensureId(element) {
  let id = element.id || element[generatedIdKey];
  if (!id) {
    id = `_id${generatedIdCount++}`;
    // Remember that we generated an ID for this element.
    element[generatedIdKey] = id;
  }
  return id;
}
