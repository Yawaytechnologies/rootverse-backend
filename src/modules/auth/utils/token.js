import jwt from 'jsonwebtoken';
import config from '../../../config/env.js';

export function signToken(payload, expiresIn = '30d') {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}


