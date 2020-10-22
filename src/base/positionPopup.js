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
    case "left":
      width = boundsRect.right - origin.x;
      break;
    case "center":
      if (direction === "above" || direction === "below") {
        width = boundsRect.width;
      } else {
        height = boundsRect.height;
      }
      break;
    case "right":
      width = origin.x - boundsRect.left;
      break;
    case "top":
      height = boundsRect.bottom - origin.y;
      break;
    case "bottom":
      height = origin.y - boundsRect.top;
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
 * @param {DOMRect} popupRect
 * @param {DOMRect} boundsRect
 */
function getPositionedRect(
  sourceOrigin,
  popupRect,
  boundsRect,
  direction,
  align
) {
  let x;
  let y;
  let height;
  let width;
  switch (direction) {
    case "above":
      y = sourceOrigin.y - popupRect.height;
      break;
    case "below":
      y = sourceOrigin.y;
      break;
    case "left":
      x = sourceOrigin.x - popupRect.width;
      break;
    case "right":
      x = sourceOrigin.x;
      break;
  }
  switch (align) {
    case "bottom":
      y = sourceOrigin.y - popupRect.height;
      break;
    case "left":
      x = sourceOrigin.x;
      break;
    case "center":
      if (direction === "above" || direction === "below") {
        x = sourceOrigin.x - popupRect.width / 2;
      } else {
        y = sourceOrigin.y - popupRect.height / 2;
      }
      break;
    case "right":
      x = sourceOrigin.x - popupRect.width;
      break;
    case "top":
      y = sourceOrigin.y;
      break;
  }
  // If we positioned the popup at the desired (x, y) origin with its current
  // height/width, that rectangle may not lie completely in the boundsRect.
  // Force the rectangle to fit by taking its intersection with the boundsRect.
  x = Math.max(x, boundsRect.left);
  y = Math.max(y, boundsRect.top);
  width = Math.min(popupRect.width, boundsRect.right - x);
  height = Math.min(popupRect.height, boundsRect.bottom - y);
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
      if (direction === "above" || direction === "below") {
        x = sourceRect.left + sourceRect.width / 2;
      } else {
        y = sourceRect.top + sourceRect.height / 2;
      }
      break;
  }
  return { x, y };
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
      },
      vertical: {
        bottom: "bottom",
        center: "center",
        end: "bottom",
        start: "top",
        top: "top",
      },
    }[crossAxis][logicalAlign] || defaultAlign;
  return {
    align: physicalAlign,
    direction: physicalDirection,
    rightToLeft,
  };
}

/**
 * Position the popup element with respect to a source element.
 *
 * @param {DOMRect} sourceRect
 * @param {DOMRect} popupRect
 * @param {DOMRect} boundsRect
 * @param {any} options
 */
export default function positionPopup(
  sourceRect,
  popupRect,
  boundsRect,
  options
) {
  const normalized = normalizeOptions(options);

  // Given the direction and alignment, which layouts do we want to consider?
  const layouts = prioritizedLayouts(normalized.direction, normalized.align);
  // Find the first layout that lets the popup fit in the bounds.
  const bestLayout = layouts.find(({ align, direction }) => {
    const sourceOrigin = getSourceOrigin(sourceRect, direction, align);
    const { height, width } = availableSpace(
      sourceOrigin,
      boundsRect,
      direction,
      align
    );
    return popupRect.height <= height && popupRect.width <= width;
  });
  // If we didn't find any layout that works, take the first one.
  const layout = bestLayout || layouts[0];
  const { align, direction } = layout;

  // With respect to which point on the source will we position the popup?
  const sourceOrigin = getSourceOrigin(sourceRect, direction, align);

  // Find the positioned rect with respect to the source origin.
  return getPositionedRect(
    sourceOrigin,
    popupRect,
    boundsRect,
    direction,
    align
  );
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

  if (preferredAlign === "center") {
    // Center align only needs to consider flipping over main axis.
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
