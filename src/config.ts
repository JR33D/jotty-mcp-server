import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  JOTTY_BASE_URL: z.string().url(),
  JOTTY_API_KEY: z.string().startsWith('ck_'),
  API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
