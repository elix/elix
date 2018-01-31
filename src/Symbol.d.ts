// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

// Our polyfill will return a string on IE 11, but for type-checking purposes,
// we can assume we'll always get a real symbol.
export default function Symbol(descriptor: string): symbol;
