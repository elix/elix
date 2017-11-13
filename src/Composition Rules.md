# Conventions for extending base class methods and properties in a mixin

Mixins functions that extend a class by creating a subclass should generally
*extend* base class methods and properties, not replace them.

The default behavior in JavaScript is for subclass members to override members
with corresponding names in base classes. That behavior may be useful in cases
where a subclass is extending a known, fixed base class. In those cases, the
subclass author generally knows what the base class can do, and can invoke base
class behavior if desired via `super`. Depending on knowledge of the base class,
the subclass author may elect not to invoke the base class implementation.

However, mixins may be applied to a variety of base classes. Accidental name
collisions may easily occur, breaking functionality in a base class. To avoid
this problem, mixin authors should write methods and properties that add
functionality to base classes rather than replacing it. This increases the
chance that base class functionality will continue to work even in the presence
of mixins.

Generally, this means that mixin methods and properties should invoke `super`.
Unlike the normal application of `super` in subclasses, mixins do not have any
guarantee that a base class actually implements a given method or property.
Hence, the mixin cannot just blindly invoke `super` — it must generally inspect
the base class first for the presence of the method or property and, only if it
exists, invoke `super`.

There is, unfortunately, no single solution that works for all kinds of mixin
members. Instead, you can follow the series of rules presented below.


# Method known to not return a result

This is the simplest case. Your mixin method should check to see whether the
base defines a method of the same name, and if so, invoke that method. In most
cases, you should invoke the super method before performing your own mixin work.

    let Mixin = (base) => class Mixin extends base {
      method(...args) {
        if (super.method) { super.method(...args); }
        // Do your mixin work here.
      }
    };

Be sure to pass along any arguments to the base class’ method implementation.

# Method that may return a result

If the base class method might return a result, you should capture that result
before doing mixin work. Your mixin has the opportunity to modify the base
method’s result, or can leave it unchanged. In any event, your mixin method
should itself return a result.

    let Mixin = (base) => class Mixin extends base {
      method(...args) {
        let result = super.method && super.method(...args);
        // Do your mixin work here, potentially modifying result.
        return result;
      }
    };


# Property getter with no setter

If you’re certain that a property will *never* have a setter, you can omit
defining a setter. But if any other mixin might define a setter for the
property, you need to define one, too. Otherwise the absence of a setter will
implicitly override a setter further up the prototype chain.

To avoid this problem, define a default setter that checks to see whether it
should invoke super. To check the base class for the existence of a property,
use the idiom, `'name' in base.prototype`.

Your getter will generally want to override the base class implementation, so it
does not need to invoke super.

    let Mixin = (base) => class Mixin extends base {
      get property() {
        // Do your mixin work here.
      }
      set property(value) {
        if ('property' in base.prototype) { super.property = value; }
      }
    };

Note the use of `base.prototype` instead of `super` in the check — `'name' in
super` is not legal ES6. However, the use of `super` *is* required in the
actual `super.prototype = value` assignment which follows. Using
`base.prototype` there wouldn’t work: it would overwrite the base’s setter
instead of invoking it.


# Property setter with no getter

It’s possible that your mixin will want to define a setter but not a getter:
your mixin may want to do work when the property changes, but leave the actual
retrieval of the property to a base class.

In such situations, you must still supply a default getter that invokes super.
(Otherwise, the absence of a getter in your mixin will implicitly override a
getter defined further up the prototype chain.) Your getter does not need to
check to see whether it should invoke super — if the base class doesn’t define
the property, the result will be undefined anyway.

    let Mixin = (base) => class Mixin extends base {
      get property() {
        return super.property;
      }
      set property(value) {
        if ('property' in base.prototype) { super.property = value; }
        // Do your mixin work here.
      }
    };


# Property with both getter and setter

This is a combination of the above two rules. The getter will generally want to
override the base class property, so it doesn’t need to invoke super. The setter
should use the same technique above to see whether it should invoke super.

    let Mixin = (base) => class Mixin extends base {
      get property() {
        // Do your mixin work here.
      }
      set property(value) {
        if ('property' in base.prototype) { super.property = value; }
        // Do your mixin work here.
      }
    };


# Property with a getter and setter that "backs" a value

A common case of the above rule is a mixin that will store the value of
property for the benefit of other mixins and classes. Such a mixin is said to
"back" the property.

In this situation, the recommendation is to have the setter record the new value
of the property *before* invoking `super`. This ensures that, if the superclass
immediately inspects the property's value, the latest value will be returned.
Other work of the mixin should be done *after* invoking `super`, as usual.

    let propertySymbol = Symbol();

    let Mixin = (base) => class Mixin extends base {
      get property() {
        return this[propertySymbol];
      }
      set property(value) {
        this[propertySymbol] = value;
        if ('property' in base.prototype) { super.property = value; }
        // Do any other mixin work here.
      }
    };
