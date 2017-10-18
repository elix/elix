export default function LanguageDirectionMixin(Base) {
  return class LanguageDirection extends Base {

    // The only way to get text direction is to wait for the component to mount
    // and then inspect the computed style on its root element. This
    // unfortunately means that, in a right-to-left language, the component will
    // end up rendering twice.
    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      const root = this.root;
      if (root) {
        const direction = getComputedStyle(root).direction;
        if (this.state.direction !== direction) {
          this.setState({ direction });
        }
      } else {
        console.warn(`LanguageDirectionMixin expects a component to define a "ref" for its root element.`);
      }
    }

    get rightToLeft() {
      return this.state.direction === 'rtl';
    }

  }
}
