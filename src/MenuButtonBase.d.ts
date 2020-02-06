// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import PopupButtonBase from "./PopupButtonBase.js";

export default class MenuButtonBase extends PopupButtonBase {
  defaultMenuSelectedIndex: number;
  highlightSelectedItemAndClose(): Promise<void>;
  readonly items: ListItemElement[];
  menuPartType: PartDescriptor;
}
