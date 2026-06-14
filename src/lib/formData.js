export function getFormData(inputs, callback) {
  const formData = new FormData();

  if (!inputs || typeof inputs !== "object") {
    callback?.(formData);
    return formData;
  }

  Object.entries(inputs).forEach(([key, value]) => {
    // Skip undefined or null
    if (value === undefined || value === null) return;

    // Handle File and Blob objects
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    // Handle Date Objects
    else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    }
    // Handle Arrays
    else if (Array.isArray(value)) {
      handleArrayValue(formData, key, value);
    }
    // Handle Objects (plain objects)
    else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }
    // Handle Primitives (Strings, Numbers, Booleans, etc.)
    else {
      formData.append(key, value);
    }
  });

  callback?.(formData);

  return formData;
}

function handleArrayValue(formData, key, value) {
  if (value.length === 0) return;

  // If array contains Files or Blobs, append them individually
  const hasFileOrBlob = value.some((item) => item instanceof File || item instanceof Blob);

  if (hasFileOrBlob) {
    value.forEach((item) => {
      if (item instanceof File || item instanceof Blob) {
        formData.append(key, item);
      }
    });
  } else {
    formData.append(key, JSON.stringify(value));
  }
}
