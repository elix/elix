import * as symbols from './symbols.js';
import * as template from './template.js';
import DarkModeMixin from './DarkModeMixin.js';
import SeamlessButton from './SeamlessButton.js';


const Base =
  DarkModeMixin(
    SeamlessButton
  );


/**
 * A small dot used to represent the items in a carousel-like element.
 * 
 * This is used as the default proxy element in [Carousel](Carousel).
 * 
 * @inherits SeamlessButton
 * @mixes DarkModeMixin
 */
class PageDot extends Base {

  componentDidMount() {
    super.componentDidMount();
    this.setAttribute('role', 'none');    
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    const { darkMode } = this.state;
    // Wait for knowledge of dark mode
    if (changed.darkMode && darkMode !== null) {
      this.style.backgroundColor = darkMode ?
        'rgb(255, 255, 255)' :
        'rgb(0, 0, 0)';
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
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
    `);
  }

}

customElements.define('elix-page-dot', PageDot);
export default PageDot;
