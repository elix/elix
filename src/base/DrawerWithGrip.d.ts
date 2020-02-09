// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Drawer from "./Drawer.js";

export default class DrawerWithGrip extends Drawer {
  fromEdge: "bottom" | "end" | "left" | "right" | "start" | "top";
  gripPartType: PartDescriptor;
}
