import layoutPopup from "../../src/base/layoutPopup.js";
import { assert } from "../testHelpers.js";

describe("layoutPopup helper", () => {
  // This unit test replicates an example in demos/popupLayout.html.
  it("column/start layout, room available", async () => {
    const sourceRect = new DOMRect(50, 0, 50, 30);
    const popupRect = new DOMRect(0, 0, 100, 60);
    const boundsRect = new DOMRect(0, 0, 150, 90);
    const layout = layoutPopup(sourceRect, popupRect, boundsRect, {
      align: "start",
      direction: "column",
    });
    assert.equal(layout.align, "left");
    assert.equal(layout.direction, "below");
    assert.equal(layout.rect.x, 50);
    assert.equal(layout.rect.y, 30);
    assert.equal(layout.rect.width, 100);
    assert.equal(layout.rect.height, 60);
  });

  // This unit test replicates an example in demos/popupLayout.html.
  it("column/start layout, flip both to fit", async () => {
    const sourceRect = new DOMRect(100, 60, 50, 30);
    const popupRect = new DOMRect(0, 0, 100, 60);
    const boundsRect = new DOMRect(0, 0, 150, 90);
    const layout = layoutPopup(sourceRect, popupRect, boundsRect, {
      align: "start",
      direction: "column",
    });
    assert.equal(layout.align, "right");
    assert.equal(layout.direction, "above");
    assert.equal(layout.rect.x, 50);
    assert.equal(layout.rect.y, 0);
    assert.equal(layout.rect.width, 100);
    assert.equal(layout.rect.height, 60);
  });
});
