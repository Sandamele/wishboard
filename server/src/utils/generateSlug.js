export const generateSlug = (name) => {
  const base = name.toLowerCase().split(" ").join("+");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${random}`;
};
