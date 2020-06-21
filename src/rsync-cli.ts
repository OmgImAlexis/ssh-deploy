import { promisify } from 'util';
import { sync as commandExists } from 'command-exists';
import { get as nodeCmd }  from 'node-cmd';
import core from '@actions/core';

const runCommand = promisify(nodeCmd);

export const ensureRsyncIsInstalled = async () => {
  const rsyncCli = commandExists('rsync');
  if (!rsyncCli) {
    await runCommand('sudo apt-get --no-install-recommends install rsync', (data, stderr) => {
      core.info(`✅ [CLI] Rsync installed. \n${data}\n${stderr}`);
    }).catch(error => {
      core.error(`⚠️ [CLI] Rsync installation failed. Aborting ... ${error.message}`);
      process.abort();
    });
  }
};

export const validateInputs = (inputs: {
  [key: string]: any
}) => {
  const inputKeys = Object.keys(inputs);
  const validInputs = inputKeys.filter((inputKey) => {
    const inputValue = inputs[inputKey];

    if (!inputValue) {
      core.error(`⚠️ [INPUTS] ${inputKey} is mandatory`);
    }

    return inputValue;
  });

  if (validInputs.length !== inputKeys.length) {
    core.error(`⚠️ [INPUTS] Inputs not valid, aborting ...`);
    process.abort();
  }
};
