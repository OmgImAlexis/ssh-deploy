import { ensureRsyncIsInstalled } from './rsync-cli';
import { addSshKey } from './ssh-key';
import { runRsync } from './run-rsync';

const {
  DEPLOY_KEY_NAME
} = process.env;

export const sshDeploy = async ({ src, dest, args, host = 'localhost', port, username, privateKeyContent }) => {
  const privateKey = addSshKey(privateKeyContent, DEPLOY_KEY_NAME || 'deploy_key');
  const remoteDest = `${username}@${host}:${dest}`;

  await ensureRsyncIsInstalled();
  await runRsync({ privateKey, port, src, dest: remoteDest, args });
};
