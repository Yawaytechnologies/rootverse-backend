import jwt from 'jsonwebtoken';
import config from '../../../config/env.js';

export function signToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}


