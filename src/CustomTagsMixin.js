import Symbol from './Symbol.js';


const customTagsKey = Symbol('customTags');


export default function CustomTagsMixin(Base) {

  return class CustomTags extends Base {

    get customTags() {
      return Object.assign({}, super.customTags, this[customTagsKey]);
    }
    set customTags(customTags) {
      const parsed = typeof customTags === 'string' ?
        parseTagsDeclarations(customTags) :
        customTags;
      this[customTagsKey] = parsed;
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
