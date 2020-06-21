import { join } from 'path';
import { writeFileSync } from 'fs';
import core from '@actions/core';
import { validateDir, validateFile } from './helpers';

const {
  HOME
} = process.env;

export const addSshKey = (key: string, name: string) => {
  const sshDir = join(HOME || __dirname, '.ssh');
  const filePath = join(sshDir, name);

  validateDir(sshDir);
  validateFile(`${sshDir}/known_hosts`);

  try {
    writeFileSync(filePath, key, {
      encoding: 'utf8',
      mode: 0o600
    });
  } catch (error) {
    core.error(`⚠️ writeFileSync error\n${filePath}\n${error.message}`);
    process.abort();
  }

  core.info(`✅ Ssh key added to \`.ssh\` dir ${filePath}`);

  return filePath;
};
