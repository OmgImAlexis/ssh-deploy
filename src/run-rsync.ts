import { promisify } from 'util';
import * as core from '@actions/core';
import nodeRsync from 'rsyncwrapper';

const rsync = promisify(nodeRsync);

const defaultOptions = {
  ssh: true,
  sshCmdArgs: ['-o StrictHostKeyChecking=no'],
  recursive: true
};

export const runRsync = async ({ privateKey, port, src, dest, args }) => {
  core.info(`[Rsync] Starting Rsync Action: ${src} to ${dest}`);

  return rsync({ src, dest, args, privateKey, port, ...defaultOptions }).catch(error => {
    core.setFailed(`⚠️ [Rsync] command error: \n${error.message}\n${error.stack}`);
    process.exit();
  });
};
