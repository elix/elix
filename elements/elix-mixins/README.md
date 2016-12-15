# elix-mixins

Mixin library for creating web components in plain JavaScript (ES5 or ES6)

[![npm version](https://img.shields.io/npm/v/elix-mixins.svg?style=flat)](https://www.npmjs.com/package/elix-mixins)

This library implements common web component features as JavaScript mixins. It
is designed for people who would like to create web components in plain
JavaScript while avoiding much of the boilerplate that comes up in component
creation. The mixins permit flexibility and a pay-as-you-go approach to
complexity and performance.

Design goals:

1. **Focus each mixin on solving a single, common component task.**
   Each mixin should be useful on its own, or in combination.
2. **Introduce as few new concepts as possible.**
   A developer who understands the DOM API should be able to work with these
   mixins without having to substantially change the way they write code. They
   shouldn't have to learn many proprietary concepts beyond those listed below,
   chiefly the notion of defining a mixin as a function.
3. **Anticipate native browser support for ES6 and web components.**
   The architecture should be useful in an ES5 application today, but should
   also feel correct in a future world in which native ES6 and web components
   are everywhere.

All of the top-level Elix Components are constructed with these mixins. In
fact, by design, most of those components are little more than combinations of
mixins. That factoring allows you to create your own web components in the
likely event that your needs differ from those driving the design of the Elix
Components. You can use these mixins without using those components.
