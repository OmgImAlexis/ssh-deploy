import path from 'path';
import { promisify } from 'util';
import core from '@actions/core';
import nodeRsync from 'rsyncwrapper';
import { ensureRsyncIsInstalled, validateInputs } from './rsync-cli';
import { addSshKey } from './ssh-key';

const rsync = promisify(nodeRsync);

const {
  REMOTE_HOST, REMOTE_USER,
  REMOTE_PORT, SSH_PRIVATE_KEY, DEPLOY_KEY_NAME,
  SOURCE, TARGET, ARGS,
  GITHUB_WORKSPACE
} = process.env;

const defaultOptions = {
  ssh: true,
  sshCmdArgs: ['-o StrictHostKeyChecking=no'],
  recursive: true
};

core.info(`[general] GITHUB_WORKSPACE: ${GITHUB_WORKSPACE}`);

const runRsync = async ({ privateKey, port, src, dest, args }) => {
  core.info(`[Rsync] Starting Rsync Action: ${src} to ${dest}`);

  return rsync({ src, dest, args, privateKey, port, ...defaultOptions }).catch(error => {
    core.error('⚠️ [Rsync] command error: \n${error.message}\n${error.stack}');
    throw error;
  });
};

const sshDeploy = async ({ src, dest, args, host = 'localhost', port, username, privateKeyContent }) => {
  const privateKey = addSshKey(privateKeyContent, DEPLOY_KEY_NAME || 'deploy_key');
  const remoteDest = `${username}@${host}:${dest}`;

  await ensureRsyncIsInstalled();
  await runRsync({ privateKey, port, src, dest: remoteDest, args });
};

const run = async () => {
  validateInputs({ SSH_PRIVATE_KEY, REMOTE_HOST, REMOTE_USER });

  return sshDeploy({
    src: path.join(GITHUB_WORKSPACE, SOURCE || ''),
    dest: TARGET || `/home/${REMOTE_USER}/`,
    args: ARGS ? [ARGS] : ['-rltgoDzvO'],
    host: REMOTE_HOST,
    port: REMOTE_PORT || '22',
    username: REMOTE_USER,
    privateKeyContent: SSH_PRIVATE_KEY
  });
};

run().catch(error => {
  core.setFailed(error.message);
});
