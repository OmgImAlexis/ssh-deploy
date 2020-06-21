'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path2 = require('path');
var path2__default = _interopDefault(path2);
var util = require('util');
var core2 = _interopDefault(require('@actions/core'));
var nodeRsync = _interopDefault(require('rsyncwrapper'));
var commandExists = require('command-exists');
var nodeCmd = require('node-cmd');
var fs = require('fs');

const runCommand = util.promisify(nodeCmd.get);
const ensureRsyncIsInstalled = async () => {
  const rsyncCli = commandExists.sync("rsync");
  if (!rsyncCli) {
    await runCommand("sudo apt-get --no-install-recommends install rsync", (data, stderr) => {
      core2.info(`✅ [CLI] Rsync installed. 
${data}
${stderr}`);
    }).catch((error) => {
      core2.error(`⚠️ [CLI] Rsync installation failed. Aborting ... ${error.message}`);
      process.abort();
    });
  }
};
const validateInputs = (inputs) => {
  const inputKeys = Object.keys(inputs);
  const validInputs = inputKeys.filter((inputKey) => {
    const inputValue = inputs[inputKey];
    if (!inputValue) {
      core2.error(`⚠️ [INPUTS] ${inputKey} is mandatory`);
    }
    return inputValue;
  });
  if (validInputs.length !== inputKeys.length) {
    core2.error(`⚠️ [INPUTS] Inputs not valid, aborting ...`);
    process.abort();
  }
};

const {GITHUB_WORKSPACE} = process.env;
const validateDir = (dir) => {
  if (!fs.existsSync(dir)) {
    core2.info(`[SSH] Creating ${dir} dir in ${GITHUB_WORKSPACE}`);
    fs.mkdirSync(dir);
    core2.info("✅ [SSH] dir created.");
  } else {
    core2.info(`[SSH] ${dir} dir exist`);
  }
};
const validateFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    core2.error(`[SSH] ${filePath} file exist`);
    return;
  }
  core2.info(`[SSH] Creating ${filePath} file in ${GITHUB_WORKSPACE}`);
  try {
    fs.writeFileSync(filePath, "", {
      encoding: "utf8",
      mode: 384
    });
    core2.info("✅ [SSH] file created.");
  } catch (e) {
    core2.error("⚠️ [SSH] writeFileSync error\n${filePath}\n${error.message}");
    process.abort();
  }
};

const {HOME} = process.env;
const addSshKey = (key, name) => {
  const sshDir = path2.join(HOME || __dirname, ".ssh");
  const filePath = path2.join(sshDir, name);
  validateDir(sshDir);
  validateFile(`${sshDir}/known_hosts`);
  try {
    fs.writeFileSync(filePath, key, {
      encoding: "utf8",
      mode: 384
    });
  } catch (error) {
    core2.error(`⚠️ writeFileSync error
${filePath}
${error.message}`);
    process.abort();
  }
  core2.info(`✅ Ssh key added to \`.ssh\` dir ${filePath}`);
  return filePath;
};

let __assign = Object.assign;
const rsync = util.promisify(nodeRsync);
const {REMOTE_HOST, REMOTE_USER, REMOTE_PORT, SSH_PRIVATE_KEY, DEPLOY_KEY_NAME, SOURCE, TARGET, ARGS, GITHUB_WORKSPACE: GITHUB_WORKSPACE$1} = process.env;
const defaultOptions = {
  ssh: true,
  sshCmdArgs: ["-o StrictHostKeyChecking=no"],
  recursive: true
};
core2.info(`[general] GITHUB_WORKSPACE: ${GITHUB_WORKSPACE$1}`);
const runRsync = async ({privateKey, port, src, dest, args}) => {
  core2.info(`[Rsync] Starting Rsync Action: ${src} to ${dest}`);
  return rsync(__assign({src, dest, args, privateKey, port}, defaultOptions)).catch((error) => {
    core2.error("⚠️ [Rsync] command error: \n${error.message}\n${error.stack}");
    throw error;
  });
};
const sshDeploy = async ({src, dest, args, host = "localhost", port, username, privateKeyContent}) => {
  const privateKey = addSshKey(privateKeyContent, DEPLOY_KEY_NAME || "deploy_key");
  const remoteDest = `${username}@${host}:${dest}`;
  await ensureRsyncIsInstalled();
  await runRsync({privateKey, port, src, dest: remoteDest, args});
};
const run = async () => {
  validateInputs({SSH_PRIVATE_KEY, REMOTE_HOST, REMOTE_USER});
  return sshDeploy({
    src: path2__default.join(GITHUB_WORKSPACE$1, SOURCE || ""),
    dest: TARGET || `/home/${REMOTE_USER}/`,
    args: ARGS ? [ARGS] : ["-rltgoDzvO"],
    host: REMOTE_HOST,
    port: REMOTE_PORT || "22",
    username: REMOTE_USER,
    privateKeyContent: SSH_PRIVATE_KEY
  });
};
run().catch((error) => {
  core2.setFailed(error.message);
});
