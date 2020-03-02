This folder contains the Elix base components: implementations of extremely common general-purpose user interface patterns. They are all designed to satisfy the [Gold Standard checklist for Web Components](https://github.com/webcomponents/gold-standard/wiki) so that they can work in a wide variety of situations.

See the [documentation](https://elix.org/documentation/elements) for more details about each element, including live demos.

These base components are not meant to be instantiated directly, but are meant to serve as the base classes for components that can be instantiated. You can think of these base classes as abstract classes that require addition information — particularly styling — to create directly classes you can instantiate on a page.

You can implement a design system as a collection of web components built on these base classes. For an example, see the components in the Plain reference design system in the peer `plain` folder. Most of the classes here have a corresponding class in the Plain design system. E.g., the [Carousel](https://elix.org/documentation/Carousel) base class has a subclass called [PlainCarousel](https://elix.org/documentation/PlainCarousel).

Since no solution is perfect for everyone, these base classes are themselves built from [mixins](https://elix.org/documentation/mixins) that you can recombine to suit your needs. In that case, you may find the base classes helpful as reference examples.
