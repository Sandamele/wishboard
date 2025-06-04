export const removeBearer = (token) => {
  if (typeof token !== "string") return null;
  if (token.toLowerCase().startsWith("bearer ")) {
    return token.slice(7).trim();
  }
  return token.trim();
};
