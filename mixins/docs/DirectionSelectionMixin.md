# API Documentation
<a name="module_DirectionSelectionMixin"></a>

## DirectionSelectionMixin ⇒ <code>Class</code>
Mixin which maps direction semantics (goLeft, goRight, etc.) to selection
semantics (selectPrevious, selectNext, etc.).

This mixin can be used in conjunction with
[KeyboardDirectionMixin](KeyboardDirectionMixin) (which maps keyboard
events to directions) and a mixin that handles selection like
[SingleSelectionMixin](SingleSelectionMixin).

**Returns**: <code>Class</code> - The extended class  

| Param | Type | Description |
| --- | --- | --- |
| base | <code>Class</code> | The base class to extend |

