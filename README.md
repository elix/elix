# Elix ![Build status](https://travis-ci.org/elix/elix.svg?branch=master)

Elix is a community-driven collection of high-quality web components for common
user interface patterns.

Most applications make use of common, general-purpose user interface patterns
such lists, menus, dialogs, carousels, and so on. Such patterns can be
efficiently implemented and packaged as web components. Their modular nature
lets you easily incorporate web components into your web application, and their
standard definition ensures good results across browsers.

This arrangement permits a beneficial economy of scale, as common patterns only
have to be implemented once. But that is not to say that it’s easy to develop
general-purpose user interface patterns as solid components. To the contrary,
implementing even simple patterns with a very high degree of quality can entail
substantial complexity.

For that reason, the Elix project believes that implementing high-quality,
general-purpose components is best done as a community effort. This spreads the
cost of creating the components across organizations, and ensures that the
resulting components satisfy a broad range of concerns and can be used in many
contexts.

_Elix and its community-driven process are currently in a pilot phase. These
components are not ready for production use. The Elix core team will share more
about the project road map and our plans for open process as those plans come
together._


# Core principles

* **Usability excellence.** All components are designed with the experience of
  the end user in mind. Each component tries to provide the best implementation
  possible of a very common user interface pattern. The components try to
  provide a great user experience by default, freeing you from having to worry
  about small details, and letting you focus on your application’s core value.
  Elix includes universal access in its definition of usability excellence: our
  components should provide a great experience to all users regardless of
  temporary or permanent handicaps.
* **As good as HTML elements.** These components are measured against the [Gold
  Standard checklist for web
  components](https://github.com/webcomponents/gold-standard/wiki), which uses
  the built-in HTML elements as the quality bar to which web components should
  aspire. These components should work predictably and reliably in a wide
  variety of contexts and with good performance.
* **Good building blocks.** The project's components are designed to be used
  as-is, without requiring customization or further coding. But no design can
  meet every situation. (There is no One Carousel to Rule Them All.) So these
  components are factored into parts that you can readily recombine to create
  solid components to meet your needs. Composition is generally preferred over
  class inheritance as a means of aggregating behavior.
* **Use the platform.** These components are generally written as "close to the
  metal" as is possible while still allowing code to be shared across
  components. These components are not built upon a monolithic framework, nor is
  any shared runtime required to use them. By virtue of being web components,
  these elements can be used with any front-end framework.
* **Maximize the audience of potential contributors.** Designing components that
  appeal to a broad audience requires accepting contributions from a broad
  audience. For that to happen, we can’t rely on complex, project-specific
  abstractions or techniques. We try to write the component code to be as plain
  as possible, with the least amount of declarative, framework-style magic. In
  practice, that means that clear, verbose code is often prefered over tight but
  inscrutable code. For example, we’re willing to tolerate a certain degree of
  boilerplate code if that makes it easier for you to understand the code or
  step through it when you’re debugging your own application. If you’re able to
  write a simple web component in plain JavaScript, a minimal learning curve
  should allow to you to understand — and contribute to — Elix code.
* **Well-documented.** We do our best to document not only the public API of
  each component and mixin, but also the underlying intention and design
  principles. We try to document *why* something is the way it is in order to
  make the best use of a potential contributor’s time.
* **Provide a minimalist, themeable appearance.** These components are meant to
  fit unobtrusively into your application, and so come with a bare minimum of
  styling. They can be styled with CSS to achieve more distinctive visual
  effects or branding to blend seamlessly with your application’s own style.
* **Work on all mainstream browsers.** This includes the latest versions of
  Apple Safari and Mobile Safari, Google Chrome and Chrome for Android,
  Microsoft Edge and Internet Explorer 11, and Mozilla Firefox. The older
  browsers, notably IE 11, require the use of the web component v1 polyfills.
* **Open process.** The process that drives the project is as important to use
  as the code artifacts. We strive to incorporate feedback from a general web
  audience, while at the same time imposing just enough structure to keep the
  project moving forward at a consistent pace in a consistent direction.


# Repository organization

All core Elix work happens in this monorepo, keeping all sources in a single
place. This makes it easy to clone, fork, and track issues and pull requests.


# Demos

The source for the
[list box demo](https://janmiksovsky.github.io/elix/elements/demos/listBox.html)
shown in the Elix talk at the February 2017 Web
Components Remote Conf can be found on this [fork](https://github.com/JanMiksovsky/elix/tree/list-box).


# Getting started

1. **Clone or fork the project**
2. **npm install -g yarn**
3. **yarn install**
4. **gulp** Depending on your OS, you’ll see available gulp tasks listed, or if
   not, do this: *npm install -g gulp-cli*
5. **gulp build** Builds distribution .js files for all components and mixins,
   and builds elix-all.js which is a consolidated distribution file containing
   everything. Also builds JSDoc-constructed README.md documentation files and
   runs lint.

Note that the built document files are committed to the repo. After running
‘gulp build’, a ‘git status’ should show nothing new or changed.


# Unit tests

Unit tests can be run on Sauce Labs. Do do so, you will need to set the
following environment variables:

````
export SAUCE_USERNAME=elix
export SAUCE_ACCESS_KEY=<ask a core team member for this key>
````

Invoke the unit tests to be run on Sauce Labs with:

````
gulp sauce-tests
````


# Contributing

Please see our [Contributor's guide](Contributing.md).
