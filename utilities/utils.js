export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && value.trim() === '') ||
    (value.hasOwnProperty('length') && value.length === 0) ||
    (value.constructor === Object && Object.keys(value).length === 0)
  );
}
