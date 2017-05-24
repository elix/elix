/*
 * General type declarations for Elix.
 * 
 * Elix is a JavaScript project, but we use TypeScript as an internal tool to
 * confirm our code is type safe.
 */


/*
 * A class constructor is an object with a `new` method that returns an
 * instance of the indicated type.
 */
type Constructor<T> = new() => T;

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
type Mixin<BaseExpectations, MixinMembers> =
  <T extends HTMLElement & BaseExpectations>(Base: Constructor<T>) => 
    Constructor<T & MixinMembers>;
