import jwt from "jsonwebtoken";
export const createSecureJWT = (payload, expiresIn) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: expiresIn || process.env.JWT_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw error;
  }
};
