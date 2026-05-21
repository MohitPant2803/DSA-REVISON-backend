import fs from 'fs/promises';
import { logger } from '../utils/logger';

export const parseJsonFile = async <T>(filePath: string): Promise<T | null> => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      logger.error(`Failed to parse JSON file at ${filePath}:`, error);
    }
    return null;
  }
};