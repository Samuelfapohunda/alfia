import * as env from 'env-var';
import { config } from 'dotenv';

config();

export const MONGO_URI = env.get('MONGO_URI').asString() as string;
export const JWT_SECRET = env.get('JWT_SECRET').asString() as string;
export const REFRESH_TOKEN_SECRET = env.get('REFRESH_TOKEN_SECRET').asString() as string;
export const EMAIL_USER = env.get('EMAIL_USER').asString() as string;
export const EMAIL_PASSWORD = env.get('EMAIL_PASSWORD').asString() as string;
export const SEND_MAIL_EMAIL = env.get('SEND_MAIL_EMAIL').asString() as string;
export const NODE_ENV = env.get('NODE_ENV').asString() as string;
