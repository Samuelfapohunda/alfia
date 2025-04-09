import { sign } from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from 'src/config/env.config';

interface Token {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (user: any): Token => {
  const payload = { _id: user._id };
  const accessToken = sign({ payload }, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = sign({ payload }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return {
    accessToken,
    refreshToken,
  };
};
