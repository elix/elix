// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="../utilities/shared.d.ts"/>

import TabStrip from './TabStrip.js';

declare const TabStripWrapper: Mixin<{
  connectedCallback?(): void;
}, {
  connectedCallback(): void;
  selectedIndex: number;
  tabAlign: string;
  tabPosition: string;
  tabs: Element[];
  tabStrip: TabStrip
}>;

export default TabStripWrapper;
