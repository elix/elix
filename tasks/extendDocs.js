/*
 * Elix enhancements to JSDoc
 * 
 * These include:
 * * Using @inherits to indicate inheritance instead of @augments (so that JSDoc
 *   doesn't try to process base classes).
 * * Using @mixes to identify mixins.
 * * Members from base classes and mixins are copied into their inherited
 *   classes.
 * * `originalmemberof` field tracks which base class or mixin originally
 *   provided the member.
 * * `inheritance` field tracks an object's list of base classes.
 * * `classInheritedBy` field tracks a classes list of subclasses (including
 *   subsubclasses, etc.).
 * 
 * These routines work with the following objects:
 * "projectDocs": the complete set of JSDoc documentation for the project. This maps
 * object names to their corresponding documentation ("objectDocs").
 * "objectDocs": the JSDoc documentation for a single object.
 * "primaryDoclet": the zeroth documentation item in an JSDoc array.
 * "memberDoclets": all items in a JSDoc array after the zeroth item.
 */


/*
 * Given a primaryDoclet, return the base class name, identified by
 * a custom @inherits tag.
 * 
 * Ignore "HTMLElement" as a base class name.
 */
function baseClassNameInDoclet(primaryDoclet) {
  const inheritsTags = customTagsWithName(primaryDoclet, 'inherits');
  const inheritsTag = inheritsTags[0];
  const baseClassName = inheritsTag && inheritsTag.value;
  return baseClassName && baseClassName !== 'HTMLElement' ?
    baseClassName :
    null;
}

/*
 * Make a deep copy of a object.
 */
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

function customTagsWithName(primaryDoclet, name) {
  const customTags = primaryDoclet.customTags || [];
  return customTags.filter(customTag => customTag.tag === name);
}

/*
 * Compute the element tag map for the given object.
 */
function elementTagsForObject(projectDocs, objectDocs) {
  const objectDoclet = primaryDoclet(objectDocs);
  let tagMap = {};
  const baseClassName = baseClassNameInDoclet(objectDoclet);
  if (baseClassName) {
    const baseClassDocs = projectDocs[baseClassName];
    const baseClassDoclet = primaryDoclet(baseClassDocs);
    Object.assign(tagMap, baseClassDoclet.elementTags);
  }
  const elementTags = customTagsWithName(objectDoclet, 'elementtag');
  elementTags.forEach(elementTag => {
    const value = elementTag.value;
    const elementTagRegex = /{(.+)}\s+(.+)/;
    const match = elementTagRegex.exec(value);
    if (match) {
      const elementClassName = match[1];
      const elementTagName = match[2];
      Object.assign(tagMap, {
        [elementTagName]: elementClassName
      });
    }
  });
  return tagMap;
}

/*
 * Top-level entry point to add Elix documentation extensions to JSDoc project
 * documentation.
 * 
 * This is a destructive in-place operation.
 */
function extendDocs(projectDocs) {
  // @ts-ignore
  const objectsDocs = Object.values(projectDocs);

  // Extend each documented object.
  objectsDocs.forEach(objectDocs => {
    extendObjectDocs(projectDocs, objectDocs);
  });

  // Now that inheritance lists, etc., are final, resort them.
  objectsDocs.forEach(objectDocs => {
    const objectDoclet = primaryDoclet(objectDocs);
    if (objectDoclet.classInheritedBy) {
      objectDoclet.classInheritedBy.sort();
    }
    if (objectDoclet.elementUsedBy) {
      objectDoclet.elementUsedBy.sort();
    }
    if (objectDoclet.mixes) {
      objectDoclet.mixes.sort();
    }
    if (objectDoclet.mixinUsedBy) {
      objectDoclet.mixinUsedBy.sort();
    }
  });
}

/*
 * Extend the documentation for a specific object.
 */
function extendObjectDocs(projectDocs, objectDocs) {

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

  const mixinNames = objectDoclet.mixes || [];
  // Process each mixin directly on this object.
  mixinNames.forEach((mixinName, index) => {
    const mixinDocs = projectDocs[mixinName];
    // Extend mixin docs before consuming.
    extendObjectDocs(projectDocs, mixinDocs);
    extendClassDocsWithMixin(objectDocs, mixinDocs);
  });

  // Process base class if one is defined.
  const baseClassName = baseClassNameInDoclet(objectDoclet);
  if (baseClassName) {
    const baseClassDocs = projectDocs[baseClassName];
    // Extend base class docs before consuming.
    extendObjectDocs(projectDocs, baseClassDocs);
    extendClassDocsWithBaseClass(objectDocs, baseClassDocs);
    updateClassInheritanceRecords(projectDocs, objectDocs);
  }

  // Mark this object's mixins and element tags (both its own and, now,
  // inherited) as being used by this object.
  updateMixinUsageRecords(projectDocs, objectDocs);
  updateElementUsageRecords(projectDocs, objectDocs);

  // Reestablish member sort order.
  sortDoclets(objectDocs);
}

/*
 * Update the documentation for the given class to reflect mixins and members
 * inherited from the given base class.
 */
function extendClassDocsWithBaseClass(classDocs, baseClassDocs) {

  const classDoclet = primaryDoclet(classDocs);
  const baseClassDoclet = primaryDoclet(baseClassDocs);

  // Add the base class members to this class.
  extendObjectDocsWithMembers(classDocs, baseClassDocs, baseClassDoclet.name);
  
  // Add the base class's mixins to the object's list of mixins.
  const baseMixins = baseClassDoclet.mixes || [];
  if (!classDoclet.mixes) {
    classDoclet.mixes = [];
  }
  classDoclet.mixes = classDoclet.mixes.concat(baseMixins);
}

/*
 * Update the documentation for the given object to reflect mixins and members
 * applied by the given mixin.
 */
function extendClassDocsWithMixin(objectDocs, mixinDocs) {
  const objectDoclet = primaryDoclet(objectDocs);
  // Add the mixin members to this class.
  extendObjectDocsWithMembers(objectDocs, mixinDocs, objectDoclet.name);
}

/*
 * Copy the documented members of the source (a base class or mixin) to the
 * documented target. Use the supplied inheritedfrom value to indicate how these
 * members were inherited.
 */
function extendObjectDocsWithMembers(targetDocs, sourceDocs, inheritedfrom) {
  const targetDoclet = primaryDoclet(targetDocs);
  memberDoclets(sourceDocs).forEach(memberDoclet => {
    const docletCopy = clone(memberDoclet);
    docletCopy.memberof = targetDoclet.name;
    if (inheritedfrom && !docletCopy.inheritedfrom) {
      docletCopy.inheritedfrom = inheritedfrom;
    }
    targetDocs.push(docletCopy);
  });
}

/*
 * Return the array of member documentation for the given object.
 */
function memberDoclets(objectDocs) {
  return objectDocs.slice(1);
}

/*
 * Return the primary JSDoc doclet for the given object.
 */
function primaryDoclet(objectDocs) {
  return objectDocs[0];
}

/*
 * Sort the JSDoc doclets for the given object.
 */
function sortDoclets(objectDocs) {
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

/*
 * Record that the indicated class inherits from its base classes, and that
 * those classes are inherited by this class.
 */
function updateClassInheritanceRecords(projectDocs, classDocs) {
  const classDoclet = primaryDoclet(classDocs);
  classDoclet.inheritance = [];
  
  // Walk up class hierarchy.
  let baseClassName = baseClassNameInDoclet(classDoclet);
  while (baseClassName) {
    // This class inherits from this base class.
    classDoclet.inheritance.push(baseClassName);
    const baseClassDocs = projectDocs[baseClassName];
    if (baseClassDocs) {
      const baseClassDoclet = primaryDoclet(baseClassDocs);
      // This base class is inherited by this class.
      if (!baseClassDoclet.classInheritedBy) {
        baseClassDoclet.classInheritedBy = []
      }
      baseClassDoclet.classInheritedBy.push(classDoclet.name);
      baseClassName = baseClassNameInDoclet(baseClassDoclet);
    } else {
      baseClassName = null;
    }
  }
}

/*
 * Record any elements this object is using, and also that those elements are
 * being used by this object.
 */
function updateElementUsageRecords(projectDocs, objectDocs) {
  const objectDoclet = primaryDoclet(objectDocs);
  const elementTags = elementTagsForObject(projectDocs, objectDocs);
  objectDoclet.elementTags = elementTags;
  // @ts-ignore
  Object.values(elementTags).forEach(className => {
    const classDocs = projectDocs[className];
    // An element tag may refer to a standard HTMLxxx element for which we have
    // no documentation.
    if (classDocs) {
      const classDoclet = primaryDoclet(classDocs);
      if (!classDoclet.elementUsedBy) {
        classDoclet.elementUsedBy = [];
      }
      classDoclet.elementUsedBy.push(objectDoclet.name);
    }
  });
}

/*
 * Record that the given object's mixins are being used by that object.
 */
function updateMixinUsageRecords(projectDocs, objectDocs) {
  const objectDoclet = primaryDoclet(objectDocs);
  const mixinNames = objectDoclet.mixes || [];
  mixinNames.forEach((mixinName, index) => {
    const mixinDocs = projectDocs[mixinName];
    const mixinDoclet = primaryDoclet(mixinDocs);
    if (!mixinDoclet.mixinUsedBy) {
      mixinDoclet.mixinUsedBy = [];
    }
    mixinDoclet.mixinUsedBy.push(objectDoclet.name);
  });
}


// @ts-ignore
module.exports = extendDocs;
