//
// Copyright © 2016-2017 Component Kitchen, Inc. and contributors to the 
// Elix Project
//

import LabeledTabButton from './LabeledTabButton';
import renderArrayAsElements from '../mixins/renderArrayAsElements';
import Tabs from './Tabs';
import symbols from '../mixins/symbols';


/**
 * A set of tabs with default tab buttons for each tab panel. Each button will
 * have a text label extracted from the `aria-label` attribute of the
 * corresponding panel.
 *
 * This is a specialized version of the more general [Tabs](Tabs) component.
 * It's intended for the common case where the tab buttons just need a text
 * label. The tab buttons will be instances of
 * [LabeledTabButton](LabeledTabButton). If you'd like to use a different
 * element for the tab buttons, you can use the `Tabs` component directly.
 *
 * @extends Tabs
 */
class LabeledTabs extends Tabs {

  [symbols.itemsChanged]() {
    if (super[symbols.itemsChanged]) { super[symbols.itemsChanged](); }

    // Create one tab button for each panel.
    const tabStrip = this.tabStrip;
    const slot = this.shadowRoot.querySelector('slot[name="tabButtons"]');
    const tabPosition = this.tabPosition;
    renderArrayAsElements(this.items, slot, (tabPanel, tabButton) => {
      if (!tabButton || !(tabButton instanceof LabeledTabButton)) {
        tabButton = new LabeledTabButton();
        tabButton.setAttribute('tabindex', 0);
        tabButton.setAttribute('tab-position', tabPosition);
      }
      tabButton.id = tabPanel.id + '_tab';
      tabButton.textContent = tabPanel.getAttribute('aria-label');

      // Point the tab button and tab panel at each other.
      tabButton.setAttribute('aria-controls', tabPanel.id);
      tabPanel.setAttribute('aria-labelledby', tabButton.id);

      return tabButton;
    });

    tabStrip.selectedIndex = this.selectedIndex;
  }

  // HACK: A bug in WebKit and Blink prevents TabStrip from correctly applying
  // styling to a slot's default nodes. See
  // https://github.com/w3c/webcomponents/issues/631. This bug comes into play
  // when a LabeledTabs component has tabAlign set to "stretch". We work around
  // this bug by adding a style rule that explicitly styles slot children.
  get [symbols.template]() {
    let baseTemplate = super[symbols.template] || '';
    if (baseTemplate instanceof HTMLTemplateElement) {
      baseTemplate = baseTemplate.innerHTML; // Downgrade to string.
    }
    return `
      ${baseTemplate}
      <style>
        /* Workaround: see note above */
        :host([tab-align="stretch"]) slot[name="tabButtons"] > * {
          flex: 1;
        }
      </style>
    `;
  }

}


customElements.define('elix-labeled-tabs', LabeledTabs);
export default LabeledTabs;
