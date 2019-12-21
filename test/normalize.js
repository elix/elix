/*
 * Helpers to normalize results across browsers.
 */

// Trim any Unicode Left-To-Right or Right-to-Left marks that might be inserted
// by Edge.
export function trimMarks(s) {
  const directionMarksRegex = /[\u200e\u200f]/g;
  return s.replace(directionMarksRegex, "");
}
