/**
 * Position the popup element with respect to a source element.
 *
 * @private
 * @param {HTMLElement} source
 * @param {HTMLElement} popup
 * @param {any} options
 */
export default function positionPopup(source, popup, options) {
  const { popupAlign, popupDirection, rightToLeft } = options;

  // Work out which axes we're working with.
  const mainAxis = {
    column: "vertical",
    "column-reverse": "vertical",
    row: "horizontal",
    "row-reverse": "horizontal",
  }[popupDirection];
  const mapAxisToPerpendicularAxis = {
    horizontal: "vertical",
    vertical: "horizontal",
  };
  const crossAxis = mapAxisToPerpendicularAxis[mainAxis];

  // We'll need to flip certain parts of the logic for right-to-left;
  const flipMainAxis = rightToLeft && mainAxis === "horizontal";
  const flipCrossAxis = rightToLeft && crossAxis === "horizontal";

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
  const directionPositive = {
    column: true,
    "column-reverse": false,
    row: true,
    "row-reverse": false,
  }[popupDirection];
  const mainAxisPositive = flipMainAxis !== directionPositive;

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
  const normalizedAlign = flipCrossAxis
    ? { start: "end", center: "center", end: "start" }[popupAlign]
    : popupAlign;
  const crossAdjustment = {
    start: 0,
    center: (popupCrossSize - sourceCrossSize) / 2,
    end: popupCrossSize - sourceCrossSize,
  }[normalizedAlign];
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
