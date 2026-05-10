import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

/**
 * Generates a JWT token for a given user ID (ESM version)
 */
export const generateToken = (id) => {
  const secret = process.env.JSON_WEB_TOKEN_SCERET;

  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};
