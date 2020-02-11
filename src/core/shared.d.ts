/*
 * General type declarations for Elix.
 *
 * Elix is a JavaScript project, but we use TypeScript as an internal tool to
 * confirm our code is type safe.
 */

// We need to import the internal `state` symbol, but the desired import seems
// to cause TypeScript to fail at processing this file. Since we're currently
// faking the use of Symbol keys as strings (see internal.js), we can
// temporarily work around this problem by redeclaring `state` as the same
// string in internal.d.ts. When we're someday able to use real Symbol keys,
// we'll need to find a real fix for this problem.
// import { state } from './internal.js';
declare const state = "_state";

/*
 * A class constructor is an object with a `new` method that returns an
 * instance of the indicated type.
 */
type Constructor<T> = new () => T;

/*
 * A dictionary that maps strings to objects of type T.
 */
type IndexedObject<T> = {
  [key: string]: T;
};

type CustomElement = HTMLElement & {
  adoptedCallback(): void;
  attributeChangedCallback(attributeName, oldValue, newValue): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
};

/*
 * An item in a list component
 *
 * TODO: This isn't core, should be defined elsewhere.
 */
type ListItemElement = HTMLElement | SVGElement;

/*
 * An Elix mixin is a function that takes an existing class and returns a new
 * class.
 *
 * The use of a generic type `T` here is a way of indicating that the members
 * of the supplied base class automatically pass through to the result. This
 * is important because a mixin may be applied not just to HTMLElement, but to
 * a subclass of HTMLElement (often created by other mixins). The type
 * information about that input subclass should transfer to the mixin's output.
 * That ensures the use of the mixin doesn't accidentally hide members of the
 * class passed to the mixin.
 *
 * A mixin can declare optional expectations it has about its base class
 * (usually properties or methods which might be present, but which are not
 * required), as well as declare the set of any members the mixin adds to the
 * class it returns.
 *
 * Often, a member will appear in both the set of base expectations and the set
 * of members the mixin defines. Suppose a mixin defines a `foo` property. The
 * mixin might the say, "The base class I'm given _may_ have a foo property. The
 * class I return will _definitely_ have a foo property."
 */
type Mixin<BaseMembers, MixinMembers> = <T extends HTMLElement & BaseMembers>(
  Base: Constructor<T>
) => Constructor<T & MixinMembers>;

/*
 * State is generally represented with plain JavaScript object dictionaries.
 */
type PlainObject = {
  [key: string]: any;
};

/*
 * Descriptor that can be instantiated to create a part.
 */
type PartDescriptor = Constructor<HTMLElement> | string | HTMLTemplateElement;

/*
 * Mixins that add to state can indicate exactly what members they add to state.
 * This requires us to indicate what the base state starts as, which for most
 * component type definitions will be an empty object — i.e., the mixin makes no
 * expectations about what state is provided by the base class.
 */
type StateMixin<BaseMembers, BaseState, MixinMembers, MixinState> = Mixin<
  BaseMembers & {
    [state]?: BaseState;
  },
  MixinMembers & {
    [state]: BaseState & MixinState;
  }
>;
