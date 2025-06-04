import jwt from "jsonwebtoken";
export const verifySecureJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    throw error;
  }
};
