import jwt from "jsonwebtoken";
export const createSecureJWT = (payload, expiresIn = "12h") => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: expiresIn,
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw error;
  }
};
