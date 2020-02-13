// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import Explorer from "./Explorer.js";

export default class Tabs extends Explorer {
  tabAlign: "start" | "center" | "end" | "stretch";
}
