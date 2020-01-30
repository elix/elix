// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import PopupButton from "./PopupButton.js";

export default class MenuButton extends PopupButton {
  defaultMenuSelectedIndex: number;
  highlightSelectedItemAndClose(): Promise<void>;
  readonly items: ListItemElement[];
  menuPartType: PartDescriptor;
}
