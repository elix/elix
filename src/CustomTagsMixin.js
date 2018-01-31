import Symbol from './Symbol.js';


const tagsKey = Symbol('tags');


export default function CustomTagsMixin(Base) {

  return class CustomTags extends Base {

    get tags() {
      return Object.assign({}, super.tags, this[tagsKey]);
    }
    set tags(tags) {
      this[tagsKey] = typeof tags === 'string' ?
        parseTagsDeclarations(tags) :
        tags;
    }

  };

}


function parseTagsDeclarations(declarations) {

  // A token (either a name or a tag) is one or more characters,
  // exluding whitespace, colons, semicolons, and commas.
  const token = `[^\\s:,;]+`;

  // A declaration is two colon-separated tokens.
  // The colon may have whitespace on either side.
  const declaration = `(${token})\\s*:\\s*(${token})`;
  const declarationRegex = new RegExp(declaration, 'g');

  let match = declarationRegex.exec(declarations);
  const result = {};
  while (match) {
    const tagSlot = match[1];
    const tagName = match[2];
    result[tagSlot] = tagName;
    match = declarationRegex.exec(declarations);
  }

  return result;
}
