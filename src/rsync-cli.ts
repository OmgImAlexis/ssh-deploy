import { promisify } from 'util';
import { sync as commandExists } from 'command-exists';
import { get as nodeCmd }  from 'node-cmd';
import * as core from '@actions/core';

const runCommand = promisify(nodeCmd);

export const ensureRsyncIsInstalled = async () => {
  const rsyncCli = commandExists('rsync');
  if (!rsyncCli) {
    await runCommand('sudo apt-get --no-install-recommends install rsync').catch(error => {
      core.setFailed(`⚠️ [CLI] Rsync installation failed. Aborting ...\n${error.message}`);
      process.exit();
    });

    core.info(`✅ [CLI] Rsync installed.`);
  }
};
