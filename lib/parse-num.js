/**
 * Parses a string or number and returns a number. Handles strings with non-numeric prefixes.
 *
 * @param {string|number|undefined|null} str The input to be parsed.
 * @returns {number} The parsed number, or NaN if it can't be parsed.
 */
export default function parseNum(str) {
  if (typeof str === 'number') return str;
  if (!str) return NaN;

  return parseFloat(
    str.replace(/^[^\d.]*/, '').replace(/^[\d,]+/g, (m) => m.replace(/,/g, ''))
  );
}
