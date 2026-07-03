export const generateSku = (name) => {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 4);

  const timestamp = Date.now().toString().slice(-6);

  return `${prefix}-${timestamp}`;
};