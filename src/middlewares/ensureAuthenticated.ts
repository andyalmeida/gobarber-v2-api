import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw Error('JWT token is missing.');

  const [, token] = authHeader.split(' ');

  try {
    const payload = verify(token, authConfig.jwt.secret);
    const { sub } = payload as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw Error('Invalid JWT token');
  }
}
