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
 * @param {DOMRect} boundsRect
 */
function availableSpace(origin, boundsRect, direction, align) {
  let height = 0;
  let width = 0;
  const vertical = direction === "above" || direction === "below";
  switch (direction) {
    case "above":
      height = origin.y - boundsRect.top;
      break;
    case "below":
      height = boundsRect.bottom - origin.y;
      break;
    case "left":
      width = origin.x - boundsRect.left;
      break;
    case "right":
      width = boundsRect.right - origin.x;
      break;
  }
  switch (align) {
    case "bottom":
      height = origin.y - boundsRect.top;
      break;
    case "center":
    case "stretch":
      if (vertical) {
        width = boundsRect.width;
      } else {
        height = boundsRect.height;
      }
      break;
    case "left":
      width = boundsRect.right - origin.x;
      break;
    case "right":
      width = origin.x - boundsRect.left;
      break;
    case "top":
      height = boundsRect.bottom - origin.y;
      break;
  }
  height = Math.max(0, height);
  width = Math.max(0, width);
  return { height, width };
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

  // Find the first layout that lets the popup fit in the bounds, as well
  // as the layout that gives the popup the biggest area.
  let firstFitLayout;
  let biggestArea = 0;
  let biggestLayout;
  layouts.forEach((layout) => {
    const { align, direction } = layout;
    const sourceOrigin = getSourceOrigin(sourceRect, direction, align);
    const { height, width } = availableSpace(
      sourceOrigin,
      boundsRect,
      direction,
      align
    );

    // See if the layout fits in the direction of interest.
    const vertical = direction === "above" || direction === "below";
    if (
      !firstFitLayout &&
      ((vertical && popupRect.height <= height) ||
        (!vertical && popupRect.width <= width))
    ) {
      // Found a layout that fits.
      firstFitLayout = layout;
    }

    const area = height * width;
    if (area > biggestArea) {
      // Found a layout that makes the popup bigger than any we've seen so far.
      biggestArea = area;
      biggestLayout = layout;
    }
  });

  // Prefer the first layout that fits, otherwise the layout with the biggest area,
  // otherwise the first layout.
  const layout = firstFitLayout || biggestLayout || layouts[0];

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
