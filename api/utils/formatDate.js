/**
 * Format a date into 'MMM DD, YYYY' format
 * @param {string|Date} date
 * @returns {string}
 */
const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return 'Invalid date';

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default formatDate;
