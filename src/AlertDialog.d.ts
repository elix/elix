// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Dialog from './Dialog.js';

export default class AlertDialog extends Dialog {
  readonly choiceButtons: HTMLElement[];
  choiceButtonPartType: PartDescriptor;
  choices: string[];
}
