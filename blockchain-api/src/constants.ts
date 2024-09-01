
import { config } from 'dotenv';

config();

export const MAX_REQUESTS_TIME_LIMIT_IN_MILLISECONDS = 300000;
export const MAX_REQUESTS_PER_USER = 1000;
export const API_KEY = process.env.API_KEY;
export const API_HEADER_OPTIONS = {
  name: 'api-key',
  description: 'API key',
  required: true,
};

