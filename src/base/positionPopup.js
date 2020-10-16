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

  const possibilities = layoutPossibilities(popupDirection, popupAlign);
  const bestLayout = possibilities.find(({ align, direction }) => {
    const origin = sourceOrigin(source, direction, align);
    const { height, width } = availableSpace(origin, bounds, direction, align);
    // console.log(direction, align, height, width);
    return popup.offsetHeight <= height && popup.offsetWidth <= width;
  });
  const layout = bestLayout || possibilities[0];
  const { align, direction } = layout;

  // Work out which axes we're working with.
  const mainAxis = {
    above: "vertical",
    below: "vertical",
    left: "horizontal",
    right: "horizontal",
  }[direction];
  const crossAxis = {
    horizontal: "vertical",
    vertical: "horizontal",
  }[mainAxis];

  // Determine how we'll measure things on these axes.
  const mapAxisToOffsetStartProperty = {
    horizontal: "offsetLeft",
    vertical: "offsetTop",
  };
  const mainAxisOffsetStartProperty = mapAxisToOffsetStartProperty[mainAxis];
  const crossAxisOffsetStartProperty = mapAxisToOffsetStartProperty[crossAxis];
  const mapAxisToOffsetSizeProperty = {
    horizontal: "offsetWidth",
    vertical: "offsetHeight",
  };
  const mapAxisToStartProperty = {
    horizontal: "left",
    vertical: "top",
  };
  const mainOffsetSizeProperty = mapAxisToOffsetSizeProperty[mainAxis];
  const crossOffsetSizeProperty = mapAxisToOffsetSizeProperty[crossAxis];

  // Determine whether physical coordinates increase along the main axis.
  const mainAxisPositive = {
    below: true,
    above: false,
    right: true,
    left: false,
  }[direction];

  // Measure the source and popup.
  const sourceMainSize = source[mainOffsetSizeProperty];
  const popupMainSize = popup[mainOffsetSizeProperty];
  const sourceCrossSize = source[crossOffsetSizeProperty];
  const popupCrossSize = popup[crossOffsetSizeProperty];

  // Determine the offset of the source's end along the main axis.
  const sourceMainStart = source[mainAxisOffsetStartProperty];
  const sourceMainEnd = mainAxisPositive
    ? sourceMainStart + sourceMainSize
    : sourceMainStart;

  // Determine the popup's start so it touches the source's end.
  const popupMainStart = mainAxisPositive
    ? sourceMainEnd
    : sourceMainEnd - popupMainSize;

  // Determine the source's start on the cross axis.
  const sourceCrossStartOffset = source[crossAxisOffsetStartProperty];

  // Determine the popup's start on the cross axis which will give the
  // desired cross-axis alignment with the source.
  const crossAlign = {
    bottom: "end",
    center: "center",
    left: "start",
    right: "end",
    top: "start",
  }[align];
  const crossAdjustment = {
    start: 0,
    center: (popupCrossSize - sourceCrossSize) / 2,
    end: popupCrossSize - sourceCrossSize,
  }[crossAlign];
  const popupCrossStart = sourceCrossStartOffset - crossAdjustment;

  // Determine the popup's physical (top, left) coordinate from its
  // logical main- and cross-axis start properties.
  const mainStartProperty = mapAxisToStartProperty[mainAxis];
  const crossStartProperty = mapAxisToStartProperty[crossAxis];
  const popupOrigin = {
    [mainStartProperty]: popupMainStart,
    [crossStartProperty]: popupCrossStart,
  };

  return popupOrigin;
}

function layoutPossibilities(direction, align) {
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
function sourceOrigin(source, direction, align) {
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
