# API Documentation
<a name="LabeledTabs"></a>

## LabeledTabs ⇐ <code>Tabs</code>
A set of tabs with default tab buttons for each tab panel. Each button will
have a text label extracted from the `aria-label` attribute of the
corresponding panel.

This is a specialized version of the more general [Tabs](Tabs) component.
It's intended for the common case where the tab buttons just need a text
label. The tab buttons will be instances of
[LabeledTabButton](LabeledTabButton). If you'd like to use a different
element for the tab buttons, you can use the `Tabs` component directly.

  **Kind**: global class
**Extends:** <code>Tabs</code>  
