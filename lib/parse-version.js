/**
 * Parses a version string and returns a standardized version format.
 *
 * @param {string|undefined|null} str The version string to be parsed.
 * @returns {string|null} The parsed version string, or null if it can't be parsed.
 */
export default function parseVersion(str) {
  if (!str) return null;
  const match = /v?(\d+(?:\.\d+)+)/.exec(str);
  return match ? match[1] : null;
}
