# API Documentation
<a name="module_TabStripWrapper"></a>

## TabStripWrapper ⇒ <code>Class</code>
A wrapper which adds strip of tabs for selecting one of the component's
children.

The `TabStripWrapper` component does not define how a selected child is
represented. If you're looking for the standard behavior of just showing only
the selected child, you can use `TabStripWrapper` in combination with the
separate [Modes](Modes.md) component. The above combination is so common it
is provided as a single component, [Tabs](Tabs.md).

`TabStripWrapper` defines a slot named "tabButtons" into which you can slot
the buttons that will be used to select the tab panels. That slot sits inside
a [TabStrip](TabStrip.md) instance, which handles keyboard navigation and
the ordering of the tab buttons.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

