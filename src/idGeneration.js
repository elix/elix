let generatedIdCount = 0;

const generatedIdKey = Symbol('generatedId');


export function ensureId(element) {
  let id = element.id || element[generatedIdKey];
  if (!id) {
    id = `_id${generatedIdCount++}`;
    // Remember that we generated an ID for this element.
    element[generatedIdKey] = id;
  }
  return id;
}
