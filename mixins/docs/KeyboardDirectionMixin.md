# API Documentation
<a name="module_KeyboardDirectionMixin"></a>

## KeyboardDirectionMixin ⇒ <code>Class</code>
Mixin which maps direction keys (Left, Right, etc.) to direction semantics
(go left, go right, etc.).

This mixin expects the component to invoke a `keydown` method when a key is
pressed. You can use [KeyboardMixin](KeyboardMixin.md) for that
purpose, or wire up your own keyboard handling and call `keydown` yourself.

This mixin calls methods such as `goLeft` and `goRight`. You can define
what that means by implementing those methods yourself. If you want to use
direction keys to navigate a selection, use this mixin with
[DirectionSelectionMixin](DirectionSelectionMixin.md).

If the component defines a property called `symbols.orientation`, the value
of that property will constrain navigation to the horizontal or vertical axis.

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

