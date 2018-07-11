# Elix ![Build status](https://travis-ci.org/elix/elix.svg?branch=master)

[![Elix logo](https://cdn.rawgit.com/elix/elix.org/3e158c0a/public/src/images/elix.png)](https://elix.org)

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

For full documentation and demos, see https://elix.org.


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
* **Open process.**
  The process behind Elix is as important to us as the code artifacts. We strive
  to incorporate feedback from a general web audience, while at the same time
  imposing just enough structure to keep the project moving forward at a
  consistent pace in a consistent direction. To that end, all significant
  changes to the project are proposed and tracked through Request for Comments
  (RFC) documents tracked in the [Elix RFCs](https://github.com/elix/rfcs)
  repository.


# Including Elix in your project

Add the Elix package to your package.json as `elix`:
```json
{
  "dependencies": {
    "elix": "<latest version number here>"
  }
}
```

We generally recommend locking your `package.json` to a fixed Elix version number (`1.0.0` rather than `^1.0.0` or `1.x`, for example).

## A note on versioning

Elix is an ambitious attempt to deconstruct complex user interface elements into constituent parts at various levels of abstraction. We regularly feel like the project is breaking new ground at the frontier of front-end design and implementation. That can be exciting, but also means that promising implementation strategies will sometimes turn out to be dead ends. Moving forward will often entail breaking changes.

* Elix follows standard semantic version numbering, and signals breaking changes by incrementing its major project version number.
* We do our best to announce breaking changes in advance, and to provide upgrade guidance as we can.
* In some cases, we may retire a particular component or mixin and replace it with something fundamentally new.
* These user interface components are extremely complex, and are designed to be customized to work in a wide range of applications and environments. This means that even minor Elix releases may accidentally introduce breaking changes, particularly in customized components. We’ll try to fix those when we can.
* As recommended above, locking on to a specific Elix version number will let you evaluate new Elix releases — including minor releases — in a more controlled fashion.


# Building and running locally

Install the project's `devDependencies` with `npm` version 5 or greater:

1. Clone or fork the project.
2. `npm install`.
3. `npm run build`. Builds distribution .js files for all components and mixins,
   as well as demos and unit tests. (Note: All Elix components and mixins are
   written in ES6, and can be loaded with native `import` statements on browsers
   that support those. The build step is only required to create demos and tests
   that can run on older browsers.)
4. `npm start`. Go to [http://localhost:3000](http://localhost:3000) to see the demos and tests (if you like).


# Unit tests

You have multiple options to run the tests.

## Local headless browser

Run the tests locally against a headless browser.
**Fast**, takes about 1-2 seconds.
**Low coverage**, only headless chrome currently.
```
npm test
```

## Local browser 

**Fast**. As fast as you can reload the page :).
But **low coverage**. Only the browser(s) you test it in will be covered.

Run `npm start` which starts a local server, serving the files from the root
of this repo. You can run the tests by going to [http://localhost:3000/test/](http://localhost:3000/test/) (don't miss the trailing slash).

## Multiple browsers via Saucelabs 

This way of testing will have the **best coverage**, since it runs in most browsers.
But it is also the **slowest**.

Unit tests can be run on Sauce Labs. Do do so, you will need to set the
following environment variables:

```
export SAUCE_USERNAME=elix
export SAUCE_ACCESS_KEY=<ask a core team member for this key>
```

Invoke the unit tests to be run on Sauce Labs with:

```
npm run sauce-tests
```


# Contributing

Please see our [Contributor's guide](Contributing.md).

The Elix project is led by [Component Kitchen](https://component.kitchen), which offers professional support for Elix.
