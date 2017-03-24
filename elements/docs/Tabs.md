# API Documentation
<a name="Tabs"></a>

## Tabs ⇐ <code>Modes</code>
A set of pages with a tab strip governing which page is shown.

Use tabs when you want to provide a large set of options or elements than
can comfortably fit inline, the options can be coherently grouped into pages,
and you want to avoid making the user navigate to a separate page. Tabs work
best if you only have a small handful of pages, say 2–7.

This stock combination applies the [TabStripWrapper](TabStripWrapper.md) to a
[Modes](Modes.md) element. The former takes care of the relative positioning
of the tab buttons and tab panels; the latter takes care of displaying only
the currently-selected tab panel. If you'd like to create something more
complex than this arrangement, you can use either of those elements on its
own.

You will need to provide `Tabs` with the buttons that will select the
corresponding tab panels. Do this by slotting the buttons into the slot named
"tabButtons". If you don't require custom tab buttons, you can use the more
specialized [LabeledTabs](LabeledTabs.md) component, which will generate text
tab buttons for you.

  **Kind**: global class
**Extends:** <code>Modes</code>  
