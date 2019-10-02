// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/// <reference path="shared.d.ts"/>

declare const SwipeCommandsMixin: StateMixin<
  {},
  {},
  {},
  {
    swipeLeftFollowsThrough: boolean;
    swipeLeftRemovesItem: boolean;
    swipeLeftWillCommit: boolean;
    swipeRightFollowsThrough: boolean;
    swipeRightRemovesItem: boolean;
    swipeRightWillCommit: boolean;
  }
>;

export default SwipeCommandsMixin;
