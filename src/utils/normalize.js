/**
 * Utility to convert PascalCase keys to camelCase recursively
 * Handles objects, arrays, and nested structures
 */

const toCamelCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
};

const isArray = (value) => {
  return Array.isArray(value);
};

export const normalizeKeys = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle Date objects and primitives
  if (!isObject(obj) && !isArray(obj)) {
    return obj;
  }

  // Handle arrays
  if (isArray(obj)) {
    return obj.map(item => normalizeKeys(item));
  }

  // Handle objects
  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    
    if (isObject(value) || isArray(value)) {
      normalized[camelKey] = normalizeKeys(value);
    } else {
      normalized[camelKey] = value;
    }
  }

  return normalized;
};


