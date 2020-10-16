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

function getPopupOrigin(popup, sourceOrigin, direction, align) {
  // In the desired layout, which "corner" on the popup (could a real corner, or
  // could be a midpoint) touches the source origin?
  const layout = `${direction} ${align}`;
  const mapLayoutToPopupCorner = {
    "above left": "left bottom",
    "above center": "center bottom",
    "above right": "right bottom",
    "below left": "left top",
    "below center": "center top",
    "below right": "right top",
    "left top": "right top",
    "left center": "right center",
    "left bottom": "right bottom",
    "right top": "left top",
    "right center": "left center",
    "right bottom": "left bottom",
  };
  const corner = mapLayoutToPopupCorner[layout];
  const [cornerHorizontal, cornerVertical] = corner.split(" ");

  // Starting at the source origin, and taking into account the popup's size,
  // find the (x, y) position of the desired corner on the popup.
  const height = popup.offsetHeight;
  const width = popup.offsetWidth;
  const x = {
    center: sourceOrigin.x - width / 2,
    left: sourceOrigin.x,
    right: sourceOrigin.x - width,
  }[cornerHorizontal];
  const y = {
    bottom: sourceOrigin.y - height,
    center: sourceOrigin.y - height / 2,
    top: sourceOrigin.y,
  }[cornerVertical];

  return { x, y };
}

function prioritizedLayouts(direction, align) {
  const possibilties = [{ align, direction }];
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
  if (align === "center") {
    // Only need to consider possibility of flipping over main axis
    possibilties.push({
      align,
      direction: flipDirection[direction],
    });
  } else {
    // Need to consider possibilities of flipping on either axis or both
    possibilties.push({
      align: flipAlign[align],
      direction: direction,
    });
    possibilties.push({
      align,
      direction: flipDirection[direction],
    });
    possibilties.push({
      align: flipAlign[align],
      direction: flipDirection[direction],
    });
  }
  return possibilties;
}

/**
 * @private
 * @param {HTMLElement} source
 * @param {*} direction
 * @param {*} align
 */
function getSourceOrigin(source, direction, align) {
  let x;
  let y;
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

// Normalize the popup options. Convert any logical options (start, end) to
// physical options (e.g., left, right). Replace any unknown option values with
// defaults.
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
