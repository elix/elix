# API Documentation
<a name="module_DirectionSelectionMixin"></a>

## DirectionSelectionMixin ⇒ <code>Class</code>
Mixin which maps direction semantics (goLeft, goRight, etc.) to selection
semantics (selectPrevious, selectNext, etc.).

This mixin can be used in conjunction with
[KeyboardDirectionMixin](KeyboardDirectionMixin.md) (which maps keyboard
events to directions) and a mixin that handles selection like
[SingleSelectionMixin](SingleSelectionMixin.md).

**Returns**: <code>Class</code> - the extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | the base class to extend |

