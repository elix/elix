import * as symbols from './symbols.js';
import * as template from './template.js';
import CenteredStrip from './CenteredStrip.js';


/**
 * Centered strip showing selected item with a highlight color
 * 
 * [`CenteredStripHighlight` uses a system highlight, much like `ListBox`](/demos/centeredStripHighlight.html)
 * 
 * For a variation that uses opacity instead of a highlight color, see
 * [CenteredStripOpacity](CenteredStripOpacity).
 * 
 * @inherits CenteredStrip
 */
class CenteredStripHighlight extends CenteredStrip {

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.items || changed.selectedIndex) {
      // Apply `selected` style to the selected item only.
      const { selectedIndex, items } = this.state;
      if (items) {
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.classList.toggle('selected', selected);
        });
      }
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        ::slotted(*) {
          padding: 0.25em;
        }

        ::slotted(.selected) {
          background: highlight;
          color: highlighttext;
        }
      </style>
    `);
  }

}


customElements.define('elix-centered-strip-highlight', CenteredStripHighlight);
export default CenteredStripHighlight;
