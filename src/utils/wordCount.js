/**
 * Count words in a string (split on whitespace).
 * @param {string} text
 * @returns {number}
 */
function wordCount(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

module.exports = { wordCount };
