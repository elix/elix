// Given an (x, y) origin point, a bounding rectangle, and a layout, return the
// height and width of the available space in the quadrant used by that layout.
function availableSpace(origin, bounds, direction, align) {
  let height = 0;
  let width = 0;
  switch (direction) {
    case "above":
      height = origin.y - bounds.top;
      break;
    case "below":
      height = bounds.bottom - origin.y;
      break;
    case "left":
      width = origin.x - bounds.left;
      break;
    case "right":
      width = bounds.right - origin.x;
      break;
  }
  switch (align) {
    case "left":
      width = bounds.right - origin.x;
      break;
    case "center":
      if (direction === "above" || direction === "below") {
        width = bounds.right - bounds.left;
      } else {
        height = bounds.bottom - bounds.top;
      }
      break;
    case "right":
      width = origin.x - bounds.left;
      break;
    case "top":
      height = bounds.bottom - origin.y;
      break;
    case "bottom":
      height = origin.y - bounds.top;
      break;
  }
  height = Math.max(0, height);
  width = Math.max(0, width);
  return { height, width };
}

// Determine the (x, y) location at which the popup should be positioned to
// touch the indicated source origin point.
function getPopupOrigin(popup, sourceOrigin, direction, align) {
  let x;
  let y;
  switch (direction) {
    case "above":
      y = sourceOrigin.y - popup.offsetHeight;
      break;
    case "below":
      y = sourceOrigin.y;
      break;
    case "left":
      x = sourceOrigin.x - popup.offsetWidth;
      break;
    case "right":
      x = sourceOrigin.x;
      break;
  }
  switch (align) {
    case "bottom":
      y = sourceOrigin.y - popup.offsetHeight;
      break;
    case "left":
      x = sourceOrigin.x;
      break;
    case "center":
      if (direction === "above" || direction === "below") {
        x = sourceOrigin.x - popup.offsetWidth / 2;
      } else {
        y = sourceOrigin.y - popup.offsetHeight / 2;
      }
      break;
    case "right":
      x = sourceOrigin.x - popup.offsetWidth;
      break;
    case "top":
      y = sourceOrigin.y;
      break;
  }
  return { x, y };
}

// For a given layout, we will use a different point on the source element as a
// reference point to position the popup. Return that (x, y) point.
function getSourceOrigin(/** @type {HTMLElement} */ source, direction, align) {
  let x = 0;
  let y = 0;
  switch (direction) {
    case "above":
      y = source.offsetTop;
      break;
    case "below":
      y = source.offsetTop + source.offsetHeight;
      break;
    case "left":
      x = source.offsetLeft;
      break;
    case "right":
      x = source.offsetLeft + source.offsetWidth;
      break;
  }
  switch (align) {
    case "bottom":
      y = source.offsetTop + source.offsetHeight;
      break;
    case "left":
      x = source.offsetLeft;
      break;
    case "center":
      if (direction === "above" || direction === "below") {
        x = source.offsetLeft + source.offsetWidth / 2;
      } else {
        y = source.offsetTop + source.offsetHeight / 2;
      }
      break;
    case "right":
      x = source.offsetLeft + source.offsetWidth;
      break;
    case "top":
      y = source.offsetTop;
      break;
  }
  return { x, y };
}

// Normalize the popup options. Convert any logical layout options (start, end)
// to physical options (e.g., left, right). Replace any unknown option values
// with defaults.
function normalizeOptions(options) {
  const {
    popupAlign: logicalAlign,
    popupDirection: logicalDirection,
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
  };
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
    popupAlign: physicalAlign,
    popupDirection: physicalDirection,
    rightToLeft,
  };
}

/**
 * Position the popup element with respect to a source element.
 *
 * @private
 * @param {HTMLElement} source
 * @param {HTMLElement} popup
 * @param {any} bounds
 * @param {any} options
 */
export default function positionPopup(source, popup, bounds, options) {
  const { popupAlign, popupDirection } = normalizeOptions(options);

  // Given the direction and alignment, which layouts do we want to consider?
  const layouts = prioritizedLayouts(popupDirection, popupAlign);
  // Find the first layout that lets the popup fit in the bounds.
  const bestLayout = layouts.find(({ align, direction }) => {
    const sourceOrigin = getSourceOrigin(source, direction, align);
    const { height, width } = availableSpace(
      sourceOrigin,
      bounds,
      direction,
      align
    );
    return popup.offsetHeight <= height && popup.offsetWidth <= width;
  });
  // If we didn't find any layout that works, take the first one.
  const layout = bestLayout || layouts[0];
  const { align, direction } = layout;

  // With respect to which point on the source will we position the popup?
  const sourceOrigin = getSourceOrigin(source, direction, align);

  // Find the popup origin with respect to the source origin.
  const { x, y } = getPopupOrigin(popup, sourceOrigin, direction, align);

  // Return the (x, y) popup origin in (left, top) terms.
  return {
    left: x,
    top: y,
  };
}

/**
 * Given a preferred direction and alignment, determine the set of 2 or 4 layout
 * alternatives that should be considered, in priority order.
 *
 * @private
 */
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
