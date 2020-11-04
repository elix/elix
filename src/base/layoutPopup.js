/**
 * Function for positioning a popup relative to a source element.
 *
 * @module positionPopup
 */

/**
 * Given an (x, y) origin point, a bounding rectangle, and a layout, return the
 * height and width of the available space in the quadrant used by that layout.
 *
 * @private
 * @param {DOMRect} sourceRect
 * @param {DOMRect} boundsRect
 */
function availableSpace(sourceRect, boundsRect, direction, align) {
  const sourceOrigin = getSourceOrigin(sourceRect, direction, align);

  let height = 0;
  let width = 0;
  const vertical = direction === "above" || direction === "below";
  switch (direction) {
    case "above":
      height = sourceOrigin.y - boundsRect.top;
      break;
    case "below":
      height = boundsRect.bottom - sourceOrigin.y;
      break;
    case "left":
      width = sourceOrigin.x - boundsRect.left;
      break;
    case "right":
      width = boundsRect.right - sourceOrigin.x;
      break;
  }
  switch (align) {
    case "bottom":
      height = sourceOrigin.y - boundsRect.top;
      break;
    case "center":
      if (vertical) {
        width = boundsRect.width;
      } else {
        height = boundsRect.height;
      }
      break;
    case "stretch":
      if (vertical) {
        width = sourceRect.width;
      } else {
        height = sourceRect.height;
      }
      break;
    case "left":
      width = boundsRect.right - sourceOrigin.x;
      break;
    case "right":
      width = sourceOrigin.x - boundsRect.left;
      break;
    case "top":
      height = boundsRect.bottom - sourceOrigin.y;
      break;
  }
  height = Math.max(0, height);
  width = Math.max(0, width);
  return { height, width };
}

/**
 * Given two layouts, return -1 if the first is better, 1 if the second is
 * better, and 0 if they're equally good.
 *
 * Our comparison uses a heuristic that looks to see whether a layout can fit
 * the popup in height, width, or both. A layout is best if it fits both height
 * and width. If each layout only fits one dimension, then the layout that gives
 * the popup more space is preferred.
 *
 * @private
 * @param {DOMRect} sourceRect
 * @param {DOMRect} popupRect
 * @param {DOMRect} boundsRect
 */
function compareLayouts(layout1, layout2, sourceRect, popupRect, boundsRect) {
  const space1 = availableSpace(
    sourceRect,
    boundsRect,
    layout1.direction,
    layout1.align
  );
  const space2 = availableSpace(
    sourceRect,
    boundsRect,
    layout2.direction,
    layout2.align
  );
  const fitsWidth1 = popupRect.width <= space1.width;
  const fitsHeight1 = popupRect.height <= space1.height;
  const fitsEither1 = fitsWidth1 || fitsHeight1;
  const fitsBoth1 = fitsWidth1 && fitsHeight1;
  const fitsWidth2 = popupRect.width <= space2.width;
  const fitsHeight2 = popupRect.height <= space2.height;
  const fitsEither2 = fitsWidth2 || fitsHeight2;
  const fitsBoth2 = fitsWidth2 && fitsHeight2;
  const area1 = space1.width * space1.height;
  const area2 = space2.width * space2.height;
  if (fitsBoth1 && fitsBoth2) {
    // Both layouts can fit in both dimensions; they're equally good.
    return 0;
  } else if (fitsBoth1) {
    // Layout 1 has space for popup in both dimensions.
    return -1;
  } else if (fitsBoth2) {
    // Layout 2 has space for popup in both dimensions.
    return 1;
  } else if (fitsEither1 && !fitsEither2) {
    // Layout 1 fits in one dimension, layout 2 doesn't fit either.
    return -1;
  } else if (fitsEither2 && !fitsEither1) {
    // Layout 2 fits in one dimensions, layout 1 doesn't fit either.
    return 1;
  } else if (fitsEither1 && area1 > area2) {
    // Layout 1 fits in one dimension and gives popup more space.
    return -1;
  } else if (fitsEither2 && area2 > area1) {
    // Layout 2 fits in one dimension and gives popup more space.
    return 1;
  } else if (area1 > area2) {
    // Layout 1 gives popup more space.
    return -1;
  } else if (area2 > area1) {
    // Layout 2 gives popup more space.
    return 1;
  } else {
    // Layouts equally good or bad.
    return 0;
  }
}

/**
 * Determine the (x, y) location at which the popup should be positioned to
 * touch the indicated source origin point.
 *
 * @private
 * @param {DOMRect} sourceRect
 * @param {DOMRect} popupRect
 * @param {DOMRect} boundsRect
 */
function getPositionedRect(
  sourceRect,
  popupRect,
  boundsRect,
  direction,
  align
) {
  // With respect to which point on the source will we position the popup?
  const sourceOrigin = getSourceOrigin(sourceRect, direction, align);

  // We'll adjust our bounds depending upon the layout.
  let {
    x: boundsLeft,
    y: boundsTop,
    bottom: boundsBottom,
    right: boundsRight,
  } = boundsRect;

  let x = 0;
  let y = 0;
  let height = popupRect.height;
  let width = popupRect.width;
  const vertical = direction === "above" || direction === "below";
  switch (direction) {
    case "above":
      y = sourceOrigin.y - popupRect.height;
      boundsBottom = sourceOrigin.y;
      break;
    case "below":
      y = sourceOrigin.y;
      boundsTop = sourceOrigin.y;
      break;
    case "left":
      x = sourceOrigin.x - popupRect.width;
      boundsRight = sourceOrigin.x;
      break;
    case "right":
      x = sourceOrigin.x;
      boundsLeft = sourceOrigin.x;
      break;
  }
  switch (align) {
    case "bottom":
      y = sourceOrigin.y - popupRect.height;
      boundsBottom = sourceOrigin.y;
      break;
    case "left":
      x = sourceOrigin.x;
      boundsLeft = sourceOrigin.x;
      break;
    case "center":
      if (vertical) {
        x = sourceOrigin.x - popupRect.width / 2;
      } else {
        y = sourceOrigin.y - popupRect.height / 2;
      }
      break;
    case "right":
      x = sourceOrigin.x - popupRect.width;
      boundsRight = sourceOrigin.x;
      break;
    case "stretch":
      if (vertical) {
        x = sourceOrigin.x;
        width = sourceRect.width;
      } else {
        y = sourceOrigin.y;
        height = sourceRect.height;
      }
      break;
    case "top":
      y = sourceOrigin.y;
      boundsTop = sourceOrigin.y;
      break;
  }

  // Force the desired rectangle to fit within the bounds.
  x = Math.max(x, boundsLeft);
  y = Math.max(y, boundsTop);
  width = Math.min(width, boundsRight - x);
  height = Math.min(height, boundsBottom - y);

  return new DOMRect(x, y, width, height);
}

/**
 * For a given layout, we will use a different point on the source element as a
 * reference point to position the popup. Return that (x, y) point.
 *
 * @private
 * @param {DOMRect} sourceRect
 */
function getSourceOrigin(sourceRect, direction, align) {
  let x = 0;
  let y = 0;
  const vertical = direction === "above" || direction === "below";
  switch (direction) {
    case "above":
      y = sourceRect.top;
      break;
    case "below":
      y = sourceRect.bottom;
      break;
    case "left":
    case "right":
      x = sourceRect[direction];
      break;
  }
  switch (align) {
    case "bottom":
    case "top":
      y = sourceRect[align];
      break;
    case "left":
    case "right":
      x = sourceRect[align];
      break;
    case "center":
      if (vertical) {
        x = sourceRect.left + sourceRect.width / 2;
      } else {
        y = sourceRect.top + sourceRect.height / 2;
      }
      break;
    case "stretch":
      if (vertical) {
        x = sourceRect.left;
      } else {
        y = sourceRect.top;
      }
      break;
  }
  return { x, y };
}

/**
 * Return the optimum layout for the popup element with respect to a source
 * element that fits in the given bounds.
 *
 * @param {DOMRect} sourceRect
 * @param {DOMRect} popupRect
 * @param {DOMRect} boundsRect
 * @param {any} options
 */
export default function layoutPopup(
  sourceRect,
  popupRect,
  boundsRect,
  options
) {
  const normalized = normalizeOptions(options);

  // Given the direction and alignment, which layouts do we want to consider?
  const layouts = prioritizedLayouts(normalized.direction, normalized.align);

  // Sort layouts by our heuristic.
  layouts.sort((layout1, layout2) =>
    compareLayouts(layout1, layout2, sourceRect, popupRect, boundsRect)
  );

  // Take the best layout.
  const layout = layouts[0];

  // Find the positioned rect with respect to the source origin.
  layout.rect = getPositionedRect(
    sourceRect,
    popupRect,
    boundsRect,
    layout.direction,
    layout.align
  );

  return layout;
}

// Normalize the popup options. Convert any logical layout options (start, end)
// to physical options (e.g., left, right). Replace any unknown option values
// with defaults.
function normalizeOptions(options) {
  const {
    align: logicalAlign,
    direction: logicalDirection,
    rightToLeft,
  } = options;
  const defaultDirection = "below";
  const physicalDirection =
    {
      above: "above",
      below: "below",
      column: "below",
      "column-reverse": "above",
      left: "left",
      right: "right",
      row: rightToLeft ? "left" : "right",
      "row-reverse": rightToLeft ? "right" : "left",
    }[logicalDirection] || defaultDirection;
  const crossAxis = {
    above: "horizontal",
    below: "horizontal",
    left: "vertical",
    right: "vertical",
  }[physicalDirection];
  const defaultAlign = {
    horizontal: "left",
    vertical: "top",
  }[crossAxis];
  const physicalAlign =
    {
      horizontal: {
        center: "center",
        end: rightToLeft ? "left" : "right",
        left: "left",
        right: "right",
        start: rightToLeft ? "right" : "left",
        stretch: "stretch",
      },
      vertical: {
        bottom: "bottom",
        center: "center",
        end: "bottom",
        start: "top",
        stretch: "stretch",
        top: "top",
      },
    }[crossAxis][logicalAlign] || defaultAlign;
  return {
    align: physicalAlign,
    direction: physicalDirection,
    rightToLeft,
  };
}

// Given a preferred direction and alignment, determine the set of 2 or 4 layout
// alternatives that should be considered, in priority order.
function prioritizedLayouts(preferredDirection, preferredAlign) {
  const flipDirection = {
    above: "below",
    below: "above",
    left: "right",
    right: "left",
  };
  const flipAlign = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };

  // Our first choice of layout will be the preferred options.
  const possibilties = [
    { align: preferredAlign, direction: preferredDirection },
  ];

  if (preferredAlign === "center" || preferredAlign === "stretch") {
    // Center/stretch align only needs to consider flipping over main axis.
    possibilties.push({
      align: preferredAlign,
      direction: flipDirection[preferredDirection],
    });
  } else {
    // Consider possibilities of flipping on either axis or both.
    possibilties.push({
      align: flipAlign[preferredAlign],
      direction: preferredDirection,
    });
    possibilties.push({
      align: preferredAlign,
      direction: flipDirection[preferredDirection],
    });
    possibilties.push({
      align: flipAlign[preferredAlign],
      direction: flipDirection[preferredDirection],
    });
  }

  return possibilties;
}
