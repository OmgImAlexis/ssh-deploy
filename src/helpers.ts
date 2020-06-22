import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as core from '@actions/core';

const {
  GITHUB_WORKSPACE
} = process.env;

export const validateDir = (dir: string) => {
  if (existsSync(dir)) {
    core.info(`[SSH] ${dir} dir exists.`);
    return;
  }

  core.info(`[SSH] Creating ${dir} dir in ${GITHUB_WORKSPACE}`);
  mkdirSync(dir);
  core.info('✅ [SSH] dir created.');
};

export const validateFile = (filePath: string) => {
  if (existsSync(filePath)) {
    core.error(`[SSH] ${filePath} file exists.`);
    return;
  }

  core.info(`[SSH] Creating ${filePath} file in ${GITHUB_WORKSPACE}`);
  try {
    writeFileSync(filePath, '', {
      encoding: 'utf8',
      mode: 0o600
    });
    core.info('✅ [SSH] file created.');
  } catch (e) {
    core.error('⚠️ [SSH] writeFileSync error\n${filePath}\n${error.message}');
    process.abort();
  }
};
