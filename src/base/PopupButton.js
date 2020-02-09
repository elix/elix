import * as internal from "./internal.js";
import Button from "./Button.js";
import PopupButtonBase from "./PopupButtonBase.js";

class PopupButton extends PopupButtonBase {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      sourcePartType: Button
    });
  }
}

export default PopupButton;
