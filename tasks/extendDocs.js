// Elix enhancements to JSDoc

// Return an array of names for the object's base classes.
// function baseClassesForObject(docs, objectDocs) {
//   const objectDoclet = primaryDoclet(objectDocs);
//   if (objectDoclet.inheritance) {
//     // We previously calculated the base classes for this class.
//     return objectDoclet.inheritance;
//   }

//   // Base class is identified by custom @inherits tag.
//   const customTags = objectDoclet.customTags;
//   const baseClassName = customTags && customTags.length > 0 && 
//       customTags[0].tag === 'inherits' && customTags[0].value;
//   if (!baseClassName || baseClassName === 'HTMLElement') {
//     return [];
//   }
//   const baseClassDocs = docs[baseClassName];
//   const baseInheritance = baseClassDocs ?
//     baseClassesForObject(docs, baseClassDocs) :
//     [];
//   return [baseClassName, ...baseInheritance];
// }

function baseClassNameInDoclet(objectDoclet) {
  // Base class is identified by custom @inherits tag.
  const customTags = objectDoclet.customTags;
  const baseClassName = customTags && customTags.length > 0 && 
      customTags[0].tag === 'inherits' && customTags[0].value;
  return baseClassName && baseClassName !== 'HTMLElement' ?
    baseClassName :
    null;
}

// Make a deep copy of a object.
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}


// Extend the standard JSDoc results with @mixes and @inherits references.
// This is a destructive operation.
function extendDocs(docs) {
  const objectNames = Object.keys(docs);
  Object.values(docs).forEach(objectDocs => {
    extendObjectDocs(docs, objectDocs);
  });
}

// For each documented object, create a new field, `inheritance`, holding an
// array of names of classes the documented item inherits from. We leave the
// original `augments` array intact.
function extendObjectDocs(docs, objectDocs) {

  const objectDoclet = primaryDoclet(objectDocs);

  // Have we already taken care of extending this object's documentation?
  if (objectDoclet.extended) {
    return;
  }
  objectDoclet.extended = true;

  // Indicate the object's own members as originally coming from this object.
  memberDoclets(objectDocs).forEach(memberDoclet => {
    memberDoclet.originalmemberof = objectDoclet.name;
  });

  // Declare this object is origin of any mixins directly on it.
  if (!objectDoclet.mixes) {
    objectDoclet.mixes = [];
  }
  objectDoclet.mixinOrigins = new Array(objectDoclet.mixes.length);
  objectDoclet.mixinOrigins.fill(objectDoclet.name);

  // Process each mixin.
  objectDoclet.mixes.forEach((mixinName, index) => {
    const mixinDocs = docs[mixinName];
    // Extend mixin docs before consuming.
    extendObjectDocs(docs, mixinDocs);
    extendClassDocsWithMixin(objectDocs, mixinDocs);
  });

  // Process base class if one is defined.
  const baseClassName = baseClassNameInDoclet(objectDoclet);
  if (baseClassName) {
    const baseClassDocs = docs[baseClassName];
    // Extend base class docs before consuming.
    extendObjectDocs(docs, baseClassDocs);
    extendClassDocsWithBaseClass(objectDocs, baseClassDocs);
    const baseClassDoclet = primaryDoclet(baseClassDocs);
    const baseInheritance = baseClassDoclet.inheritance || []
    objectDoclet.inheritance = [baseClassName, ...baseInheritance];
  } else {
    objectDoclet.inheritance = [];
  }

  // Reestablish sort order.
  sortMembers(objectDocs);
}

function extendClassDocsWithBaseClass(classDocs, baseClassDocs) {

  const classDoclet = primaryDoclet(classDocs);
  const baseClassDoclet = primaryDoclet(baseClassDocs);

  // Add the base class members to this class.
  extendObjectDocsWithMembers(classDocs, baseClassDocs, baseClassDoclet.name);
  
  // Record that this base class is inherited by this object.
  if (!baseClassDoclet.classInheritedBy) {
    baseClassDoclet.classInheritedBy = []
  }
  baseClassDoclet.classInheritedBy.push(classDoclet.name);

  // Add the base class's mixins to the object's list of mixins.
  const baseMixins = baseClassDoclet.mixes || [];
  if (!classDoclet.mixes) {
    classDoclet.mixes = [];
  }
  classDoclet.mixes = classDoclet.mixes.concat(baseMixins);

  // Record that this base class is the origin for these mixins.
  const baseMixinOrigins = new Array(baseMixins.length);
  baseMixinOrigins.fill(baseClassDoclet.name);
  classDoclet.mixinOrigins = classDoclet.mixinOrigins.concat(baseMixinOrigins);
}

function extendClassDocsWithMixin(objectDocs, mixinDocs) {

  const objectDoclet = primaryDoclet(objectDocs);
  const mixinDoclet = primaryDoclet(mixinDocs);

  // Add the mixin members to this class.
  extendObjectDocsWithMembers(objectDocs, mixinDocs, objectDoclet.name);

  // Record that this mixin is being used by this object.
  if (!mixinDoclet.mixinUsedBy) {
    mixinDoclet.mixinUsedBy = [];
  }
  mixinDoclet.mixinUsedBy.push(objectDoclet.name);
}

// Copy the documented members of the source (a base class or mixin) to the
// documented target.
function extendObjectDocsWithMembers(targetDocs, sourceDocs, inheritedfrom) {
  const targetDoclet = primaryDoclet(targetDocs);
  const sourceDoclet = primaryDoclet(sourceDocs);
  memberDoclets(sourceDocs).forEach(memberDoclet => {
    const docletCopy = clone(memberDoclet);
    docletCopy.memberof = targetDoclet.name;
    if (inheritedfrom && !docletCopy.inheritedfrom) {
      docletCopy.inheritedfrom = inheritedfrom;
    }
    targetDocs.push(docletCopy);
  });
}

function memberDoclets(objectDocs) {
  return objectDocs.slice(1);
}

function primaryDoclet(objectDocs) {
  return objectDocs[0];
}

// We store extended information on the first item in the array of documentation
// items for a given object. This should be the documentation for the top-level
// class/module itself.
function primaryDocletForName(docs, objectName) {
  const objectDocs = docs[objectName];
  return objectDocs && primaryDoclet(objectDocs);
}

function sortMembers(objectDocs) {
  // Sort the array, leaving the primary doclet at index 0.
  objectDocs.sort((a, b) => {
    if (a.order === 0) { return -1; }
    if (b.order === 0) { return 1; }
    return a.name.localeCompare(b.name);
  });
  // Set the order value
  objectDocs.map((doclet, index) => {
    doclet.order = index;
  });
}

module.exports = extendDocs;
