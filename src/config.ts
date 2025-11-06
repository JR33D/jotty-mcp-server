import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  JOTTY_BASE_URL: z.string().url(),
  JOTTY_API_KEY: z.string().startsWith('ck_'),
  API_KEY: z.string().min(1),
});

export type Config = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return envSchema.parse(env);
}

let cachedConfig: Config | undefined;

export function getConfig(): Config {
  cachedConfig ??= loadConfig();
  return cachedConfig;
}

export function resetConfig(): void {
  cachedConfig = undefined;
}