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

  // Work out which axes we're working with.
  const mainAxis = {
    above: "vertical",
    below: "vertical",
    left: "horizontal",
    right: "horizontal",
  }[popupDirection];
  const mapAxisToPerpendicularAxis = {
    horizontal: "vertical",
    vertical: "horizontal",
  };
  const crossAxis = mapAxisToPerpendicularAxis[mainAxis];

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
  }[popupDirection];

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
  }[popupAlign];
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
