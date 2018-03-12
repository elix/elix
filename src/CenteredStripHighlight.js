import { merge } from './updates.js';
import CenteredStrip from './CenteredStrip.js';


class CenteredStripHighlight extends CenteredStrip {

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const selected = calcs.selected;
    // const showSelection = selected && this.state.focusVisible;
    const showSelection = selected;
    const color = showSelection ? 'highlighttext' : original.style.color;
    const backgroundColor = showSelection ? 'highlight' : original.style['background-color'];
    return merge(base, {
      classes: {
        selected
      },
      style: {
        'background-color': backgroundColor,
        color,
        'padding': '0.25em'
      }
    });
  }

}


customElements.define('elix-centered-strip-highlight', CenteredStripHighlight);
export default CenteredStripHighlight;
