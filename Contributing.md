# Contributor guidelines

- New components and features should have extremely broad appeal. Our goal is to
  provide great implementations of the user interface patterns which are already
  in widespread use, not to design or promote user interface innovations. We
  only consider implementing a relatively new UI idea after a large number of
  sites/applications have adopted it or expressed interest in it.
- To the extent possible, components should measure up to the [Gold
  Standard checklist for web
  components](https://github.com/webcomponents/gold-standard/wiki).
- Use standard JavaScript ES6 idioms and web platform patterns when possible.
  Strive for making the code’s intent clear to someone who is an expert web
  developer but knows nothing about this project. Example: a modest degree of
  boilerplate code replicated in multiple places may be preferable to
  introducing a new, project-specific abstraction.
- Keep an element’s public API clean. Do not expose internals on an element as
  underscore-prefixed properties or methods. Instead, use closures and Symbol
  keys to keep internals hidden.
- We use [Prettier](https://prettier.io/) to format code.
- Use [jsDoc](http://usejsdoc.org/) comments to document the public API. Our
  build system will generate the documentation from those comments.
- When in doubt, sort things alphabetically: lists of imports, mixins, etc.
  Alphabetic order is usually just as good as any other, and is often the only
  sort order anyone other than you is going to be able to remember. Exception:
  when defining members of a class, define the `constructor()` first, followed
  by the remaining members in alphabetical order.
- Capitalize the names of mixin that accept and return a class, to reflect their
  class-like nature.
- Write user interface specifications to document end-user visible behavior.
  It’s fine to reference such behavior in code comments, but try to avoid
  letting comments be the sole place where user-visible behavior is described.

# Contributor understandings

The Elix project is open source made available free of charge. Contributors
understand that all contributions to the Elix project will be licensed to
developers and other licensees pursuant to [this version](LICENSE) of the MIT
License. If you do not want your contributions to be licensed to developers and
others pursuant to the MIT License, do not make any contributions to the
project. By making contributions to the project, including contributions made
through pull requests and other modifications, you represent that you possess
all rights, including intellectual property rights, in and to your contributions
necessary in order to license your contributions to developers and others
pursuant to the MIT License. If you have reason to believe that someone other
than you, including some other person or entity, may have rights in or to a
contribution, do not make that contribution to the project. The Elix project is
administered, as a courtesy, by Component Kitchen for the benefit of the
project’s contributors and the developer community as a whole. The code,
software, web components, features and functionality, and other contributions
contributed to or otherwise made available in connection with the Elix project
are provided “as is.” In no event will Component Kitchen or its officers,
directors, or employees be liable for any claims, damages, or other liabilities,
whether in an action of contract, tort, or otherwise, arising from, out of, or
in connection with the same.
