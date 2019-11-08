[![Elix logo](demos/logo.png)](https://component.kitchen/elix)

Elix is a community-driven collection of high-quality web components for common user interface patterns.

Most applications make use of common, general-purpose user interface patterns such lists, menus, dialogs, carousels, and so on. Such patterns can be efficiently implemented and packaged as web components. Their modular nature lets you easily incorporate web components into your web application, and their standard definition ensures good results across browsers.

This arrangement permits a beneficial economy of scale, as common patterns only have to be implemented once. But that is not to say that it’s easy to develop general-purpose user interface patterns as solid components. To the contrary, implementing even simple patterns with a very high degree of quality can entail substantial complexity.

For that reason, the Elix project believes that implementing high-quality, general-purpose components is best done as a community effort. This spreads the cost of creating the components across organizations, and ensures that the resulting components satisfy a broad range of concerns and can be used in many contexts.

For full details and demos, see the [Elix documentation](https://component.kitchen/elix).

# Quick start

## Plain HTML and JavaScript

Add the Elix package to your package.json:

```json
{
  "dependencies": {
    "elix": "<latest version number here>"
  }
}
```

Then run `npm install`. We generally recommend locking your `package.json` to a fixed Elix version number (`1.0.0` rather than `^1.0.0` or `1.x`, for example). See more at [Versioning](#versioning).

In markup, you can then reference the components you need:

```html
<html>
  <head>
    <script type="module" src="node_modules/elix/define/Carousel.js"></script>
  </head>
  <body>
    <elix-carousel>
      <!-- Images and other elements go here -->
    </elix-carousel>
  </body>
</html>
```

Alternatively, in JavaScript, you can directly `import` components:

```js
import Carousel from 'elix/define/Carousel.js';

const carousel = new Carousel();
// Add images, etc., to the carousel.
const image1 = new Image();
image1.src = 'image1.jpg';
carousel.appendChild(image1);
// Add the carousel to the page.
document.body.appendChild(carousel);
```

The Elix project itself _requires no build step_. You are free to use your preferred tools to bundle the Elix modules for better network performance.

You can try out the [plain HTML and JavaScript project](https://github.com/elix/plain-example) on your own machine.

## React

See the [sample React project](https://github.com/elix/react-example) showing how to use Elix components in a React application.

## TypeScript

See the [sample TypeScript project](https://github.com/elix/typescript-example) showing how to use Elix components in a TypeScript application. Elix includes TypeScript declaration files so that you can confirm that interactions with Elix components are type safe.

# Core principles

- **Usability excellence.** All components are designed with the experience of the end user in mind. Each component tries to provide the best implementation possible of a very common user interface pattern. The components try to provide a great user experience by default, freeing you from having to worry about small details, and letting you focus on your application’s core value. Elix includes universal access in its definition of usability excellence: our components should provide a great experience to all users regardless of temporary or permanent handicaps.
- **As good as HTML elements.** These components are measured against the [Gold Standard checklist for web components](https://github.com/webcomponents/gold-standard/wiki), which uses the built-in HTML elements as the quality bar to which web components should aspire. These components should work predictably and reliably in a wide variety of contexts and with good performance.
- **Good building blocks.** The project's components are designed to be used as-is, without requiring customization or further coding. But no design can meet every situation. (There is no One Carousel to Rule Them All.) So these components are factored into parts that you can readily recombine to create solid components to meet your needs. Composition is generally preferred over class inheritance as a means of aggregating behavior.
- **Use the platform.** These components are generally written as "close to the metal" as is possible while still allowing code to be shared across components. These components are not built upon a monolithic framework, nor is any shared runtime required to use them. By virtue of being web components, these elements can be used with any front-end framework.
- **Maximize the audience of potential contributors.** Designing components that appeal to a broad audience requires accepting contributions from a broad audience. For that to happen, we can’t rely on complex, project-specific abstractions or techniques. We try to write the component code to be as plain as possible, with the least amount of declarative, framework-style magic. In practice, that means that clear, verbose code is often preferred over tight but inscrutable code. For example, we’re willing to tolerate a certain degree of boilerplate code if that makes it easier for you to understand the code or step through it when you’re debugging your own application. If you’re able to write a simple web component in plain JavaScript, a minimal learning curve should allow to you to understand — and contribute to — Elix code.
- **Well-documented.** We do our best to document not only the public API of each component and mixin, but also the underlying intention and design principles. We try to document _why_ something is the way it is in order to make the best use of a potential contributor’s time.
- **Provide a minimalist, themeable appearance.** These components are meant to fit unobtrusively into your application, and so come with a bare minimum of styling. They can be [customized](https://component.kitchen/elix/customizing) to achieve more distinctive visual effects or branding to blend seamlessly with your application’s own style.
- **Work on all mainstream browsers.** This includes the latest versions of Apple Safari and Mobile Safari, Google Chrome and Chrome for Android, and Mozilla Firefox. Microsoft Edge support will arrive once it switches to using the Chromium engine.
- **Open process.** The process behind Elix is as important to us as the code artifacts. We strive to incorporate feedback from a general web audience, while at the same time imposing just enough structure to keep the project moving forward at a consistent pace in a consistent direction. To that end, all significant changes to the project are proposed and tracked through Request for Comments (RFC) documents tracked in the [Elix RFCs](https://github.com/elix/rfcs) repository.

# Versioning

Elix is an ambitious attempt to deconstruct complex user interface elements into constituent parts at various levels of abstraction. We regularly feel like the project is breaking new ground at the frontier of front-end design and implementation. That can be exciting, but also means that promising implementation strategies will sometimes turn out to be dead ends. Moving forward will often entail breaking changes.

- Elix follows standard semantic version numbering, and signals breaking changes by incrementing its major project version number.
- We do our best to announce breaking changes in advance, and to provide upgrade guidance as we can.
- In some cases, we may retire a particular component or mixin and replace it with something fundamentally new.
- These user interface components are extremely complex, and are designed to be customized to work in a wide range of applications and environments. This means that even minor Elix releases may accidentally introduce breaking changes, particularly in customized components. We’ll try to fix those when we can.
- As recommended above, locking on to a specific Elix version number will let you evaluate new Elix releases — including minor releases — in a more controlled fashion.

# Contributing

Please see our [Contributor's guide](Contributing.md).

The Elix project is led by [Component Kitchen](https://component.kitchen), which offers professional support for Elix.
