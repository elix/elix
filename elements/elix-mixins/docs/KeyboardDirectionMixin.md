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


* [KeyboardDirectionMixin](#module_KeyboardDirectionMixin) ⇒ <code>Class</code>
    * [~KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)
        * [.symbols.goDown()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goDown)
        * [.symbols.goEnd()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goEnd)
        * [.symbols.goLeft()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goLeft)
        * [.symbols.goRight()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goRight)
        * [.symbols.goStart()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goStart)
        * [.symbols.goUp()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goUp)

<a name="module_KeyboardDirectionMixin..KeyboardDirection"></a>

### KeyboardDirectionMixin~KeyboardDirection
The class prototype added by the mixin.

  **Kind**: inner class of <code>[KeyboardDirectionMixin](#module_KeyboardDirectionMixin)</code>

* [~KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)
    * [.symbols.goDown()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goDown)
    * [.symbols.goEnd()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goEnd)
    * [.symbols.goLeft()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goLeft)
    * [.symbols.goRight()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goRight)
    * [.symbols.goStart()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goStart)
    * [.symbols.goUp()](#module_KeyboardDirectionMixin..KeyboardDirection+symbols.goUp)

<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goDown"></a>

#### keyboardDirection.symbols.goDown()
Invoked when the user wants to go/navigate down.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)</code>
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goEnd"></a>

#### keyboardDirection.symbols.goEnd()
Invoked when the user wants to go/navigate to the end (e.g., of a list).
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)</code>
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goLeft"></a>

#### keyboardDirection.symbols.goLeft()
Invoked when the user wants to go/navigate left.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)</code>
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goRight"></a>

#### keyboardDirection.symbols.goRight()
Invoked when the user wants to go/navigate right.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)</code>
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goStart"></a>

#### keyboardDirection.symbols.goStart()
Invoked when the user wants to go/navigate to the start (e.g., of a
list). The default implementation of this method does nothing.

  **Kind**: instance method of <code>[KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)</code>
<a name="module_KeyboardDirectionMixin..KeyboardDirection+symbols.goUp"></a>

#### keyboardDirection.symbols.goUp()
Invoked when the user wants to go/navigate up.
The default implementation of this method does nothing.

  **Kind**: instance method of <code>[KeyboardDirection](#module_KeyboardDirectionMixin..KeyboardDirection)</code>
