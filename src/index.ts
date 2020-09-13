import * as path from 'path';
import * as core from '@actions/core';
import { validateInputs } from './validate-inputs';
import { sshDeploy } from './ssh-deploy';

const {
  REMOTE_HOST, REMOTE_USER,
  REMOTE_PORT, SSH_PRIVATE_KEY,
  SOURCE, TARGET, ARGS,
  GITHUB_WORKSPACE
} = process.env;

const run = async () => {
  if (!GITHUB_WORKSPACE) {
    core.error('⚠️ [general] GITHUB_WORKSPACE env is missing.');
    return;
  }

  core.info(`[general] GITHUB_WORKSPACE: ${GITHUB_WORKSPACE}`);

  validateInputs({ SSH_PRIVATE_KEY, REMOTE_HOST, REMOTE_USER });

  const src = SOURCE.startsWith('/') ? SOURCE : path.join(GITHUB_WORKSPACE, SOURCE || '');
  const dest = TARGET || `/home/${REMOTE_USER}/`;

  return sshDeploy({
    src,
    dest,
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
