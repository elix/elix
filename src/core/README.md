This folder contains the tiny component kernel at the heart of the Elix components: the `ReactiveElement` base class used by all components, which in turn is composed of three mixins handling the most basic component responsibilities:

- `AttributeMarshallingMixin`, which converts changes to element attributes into changes in element properties.
- `ReactiveMixin`, which defines a basic functional-reactive programming (FRP) architecture that can track internal state and render that state to the DOM.
- `ShadowTemplateMixin`, which handles the task of populating the component's shadow root when it is first connected to the document.

You can use the `ReactiveElement` base class as the foundation for your own web components, or you can use consume the above mixins directly.

The Elix components in the peer `base` and `plain` folders all extend the `ReactiveElement` base class.
