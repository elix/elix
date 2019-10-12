import * as internal from './internal.js';
import * as template from './template.js';
import DarkModeMixin from './DarkModeMixin.js';
import SelectableButton from './SelectableButton.js';

const Base = DarkModeMixin(SelectableButton);

/**
 * A small dot used to represent the items in a carousel-like element.
 *
 * This is used as the default proxy element in [Carousel](Carousel).
 *
 * @inherits SelectableButton
 * @mixes DarkModeMixin
 */
class PageDot extends Base {
  [internal.componentDidMount]() {
    super[internal.componentDidMount]();
    this.setAttribute('role', 'none');
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    const { darkMode } = this[internal.state];
    // Wait for knowledge of dark mode
    if (changed.darkMode && darkMode !== null) {
      this.style.backgroundColor = darkMode
        ? 'rgb(255, 255, 255)'
        : 'rgb(0, 0, 0)';
    }
  }

  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
      <style>
        :host {
          border-radius: 7px;
          box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
          cursor: pointer;
          height: 8px;
          margin: 7px 5px;
          padding: 0;
          transition: opacity 0.2s;
          width: 8px;
        }

        @media (min-width: 768px) {
          :host {
            height: 12px;
            width: 12px;
          }
        }
      </style>
    `
    );
  }
}

export default PageDot;
