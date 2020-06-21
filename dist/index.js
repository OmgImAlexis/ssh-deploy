module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(225);
/******/ 	};
/******/ 	// initialize runtime
/******/ 	runtime(__webpack_require__);
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 225:
/***/ (function(__unusedmodule, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(622);

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(669);

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __webpack_require__(470);
var core_default = /*#__PURE__*/__webpack_require__.n(core);

// EXTERNAL MODULE: ./node_modules/rsyncwrapper/lib/rsyncwrapper.js
var rsyncwrapper = __webpack_require__(250);
var rsyncwrapper_default = /*#__PURE__*/__webpack_require__.n(rsyncwrapper);

// EXTERNAL MODULE: ./node_modules/command-exists/index.js
var command_exists = __webpack_require__(677);

// EXTERNAL MODULE: ./node_modules/node-cmd/cmd.js
var cmd = __webpack_require__(428);

// CONCATENATED MODULE: ./src/rsync-cli.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




const runCommand = Object(external_util_.promisify)(cmd.get);
const ensureRsyncIsInstalled = () => __awaiter(undefined, void 0, void 0, function* () {
    const rsyncCli = Object(command_exists.sync)('rsync');
    if (!rsyncCli) {
        yield runCommand('sudo apt-get --no-install-recommends install rsync', (data, stderr) => {
            core_default().info(`✅ [CLI] Rsync installed. \n${data}\n${stderr}`);
        }).catch(error => {
            core_default().error(`⚠️ [CLI] Rsync installation failed. Aborting ... ${error.message}`);
            process.abort();
        });
    }
});
const validateInputs = (inputs) => {
    const inputKeys = Object.keys(inputs);
    const validInputs = inputKeys.filter((inputKey) => {
        const inputValue = inputs[inputKey];
        if (!inputValue) {
            core_default().error(`⚠️ [INPUTS] ${inputKey} is mandatory`);
        }
        return inputValue;
    });
    if (validInputs.length !== inputKeys.length) {
        core_default().error(`⚠️ [INPUTS] Inputs not valid, aborting ...`);
        process.abort();
    }
};

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(747);

// CONCATENATED MODULE: ./src/helpers.ts


const { GITHUB_WORKSPACE } = process.env;
const validateDir = (dir) => {
    if (!Object(external_fs_.existsSync)(dir)) {
        Object(core.info)(`[SSH] Creating ${dir} dir in ${GITHUB_WORKSPACE}`);
        Object(external_fs_.mkdirSync)(dir);
        Object(core.info)('✅ [SSH] dir created.');
    }
    else {
        Object(core.info)(`[SSH] ${dir} dir exist`);
    }
};
const validateFile = (filePath) => {
    if (Object(external_fs_.existsSync)(filePath)) {
        Object(core.error)(`[SSH] ${filePath} file exist`);
        return;
    }
    Object(core.info)(`[SSH] Creating ${filePath} file in ${GITHUB_WORKSPACE}`);
    try {
        Object(external_fs_.writeFileSync)(filePath, '', {
            encoding: 'utf8',
            mode: 0o600
        });
        Object(core.info)('✅ [SSH] file created.');
    }
    catch (e) {
        Object(core.error)('⚠️ [SSH] writeFileSync error\n${filePath}\n${error.message}');
        process.abort();
    }
};

// CONCATENATED MODULE: ./src/ssh-key.ts




const { HOME } = process.env;
const addSshKey = (key, name) => {
    const sshDir = Object(external_path_.join)(HOME || __dirname, '.ssh');
    const filePath = Object(external_path_.join)(sshDir, name);
    validateDir(sshDir);
    validateFile(`${sshDir}/known_hosts`);
    try {
        Object(external_fs_.writeFileSync)(filePath, key, {
            encoding: 'utf8',
            mode: 0o600
        });
    }
    catch (error) {
        core_default().error(`⚠️ writeFileSync error\n${filePath}\n${error.message}`);
        process.abort();
    }
    core_default().info(`✅ Ssh key added to \`.ssh\` dir ${filePath}`);
    return filePath;
};

// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const rsync = Object(external_util_.promisify)(rsyncwrapper_default.a);
const { REMOTE_HOST, REMOTE_USER, REMOTE_PORT, SSH_PRIVATE_KEY, DEPLOY_KEY_NAME, SOURCE, TARGET, ARGS, GITHUB_WORKSPACE: src_GITHUB_WORKSPACE } = process.env;
const defaultOptions = {
    ssh: true,
    sshCmdArgs: ['-o StrictHostKeyChecking=no'],
    recursive: true
};
Object(core.info)(`[general] GITHUB_WORKSPACE: ${src_GITHUB_WORKSPACE}`);
const runRsync = ({ privateKey, port, src, dest, args }) => src_awaiter(undefined, void 0, void 0, function* () {
    Object(core.info)(`[Rsync] Starting Rsync Action: ${src} to ${dest}`);
    return rsync(Object.assign({ src, dest, args, privateKey, port }, defaultOptions)).catch(error => {
        Object(core.error)('⚠️ [Rsync] command error: \n${error.message}\n${error.stack}');
        throw error;
    });
});
const sshDeploy = ({ src, dest, args, host = 'localhost', port, username, privateKeyContent }) => src_awaiter(undefined, void 0, void 0, function* () {
    const privateKey = addSshKey(privateKeyContent, DEPLOY_KEY_NAME || 'deploy_key');
    const remoteDest = `${username}@${host}:${dest}`;
    yield ensureRsyncIsInstalled();
    yield runRsync({ privateKey, port, src, dest: remoteDest, args });
});
const run = () => src_awaiter(undefined, void 0, void 0, function* () {
    validateInputs({ SSH_PRIVATE_KEY, REMOTE_HOST, REMOTE_USER });
    return sshDeploy({
        src: Object(external_path_.join)(src_GITHUB_WORKSPACE, SOURCE || ''),
        dest: TARGET || `/home/${REMOTE_USER}/`,
        args: ARGS ? [ARGS] : ['-rltgoDzvO'],
        host: REMOTE_HOST,
        port: REMOTE_PORT || '22',
        username: REMOTE_USER,
        privateKeyContent: SSH_PRIVATE_KEY
    });
});
run().catch(error => {
    Object(core.setFailed)(error.message);
});


/***/ }),

/***/ 243:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var exec = __webpack_require__(129).exec;
var execSync = __webpack_require__(129).execSync;
var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var access = fs.access;
var accessSync = fs.accessSync;
var constants = fs.constants || fs;

var isUsingWindows = process.platform == 'win32'

var fileNotExists = function(commandName, callback){
    access(commandName, constants.F_OK,
    function(err){
        callback(!err);
    });
};

var fileNotExistsSync = function(commandName){
    try{
        accessSync(commandName, constants.F_OK);
        return false;
    }catch(e){
        return true;
    }
};

var localExecutable = function(commandName, callback){
    access(commandName, constants.F_OK | constants.X_OK,
        function(err){
        callback(null, !err);
    });
};

var localExecutableSync = function(commandName){
    try{
        accessSync(commandName, constants.F_OK | constants.X_OK);
        return true;
    }catch(e){
        return false;
    }
}

var commandExistsUnix = function(commandName, cleanedCommandName, callback) {

    fileNotExists(commandName, function(isFile){

        if(!isFile){
            var child = exec('command -v ' + cleanedCommandName +
                  ' 2>/dev/null' +
                  ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }',
                  function (error, stdout, stderr) {
                      callback(null, !!stdout);
                  });
            return;
        }

        localExecutable(commandName, callback);
    });

}

var commandExistsWindows = function(commandName, cleanedCommandName, callback) {
  if (/[\x00-\x1f<>:"\|\?\*]/.test(commandName)) {
    callback(null, false);
    return;
  }
  var child = exec('where ' + cleanedCommandName,
    function (error) {
      if (error !== null){
        callback(null, false);
      } else {
        callback(null, true);
      }
    }
  )
}

var commandExistsUnixSync = function(commandName, cleanedCommandName) {
  if(fileNotExistsSync(commandName)){
      try {
        var stdout = execSync('command -v ' + cleanedCommandName +
              ' 2>/dev/null' +
              ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }'
              );
        return !!stdout;
      } catch (error) {
        return false;
      }
  }
  return localExecutableSync(commandName);
}

var commandExistsWindowsSync = function(commandName, cleanedCommandName, callback) {
  if (/[\x00-\x1f<>:"\|\?\*]/.test(commandName)) {
    return false;
  }
  try {
      var stdout = execSync('where ' + cleanedCommandName, {stdio: []});
      return !!stdout;
  } catch (error) {
      return false;
  }
}

var cleanInput = function(s) {
  if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
    s = "'"+s.replace(/'/g,"'\\''")+"'";
    s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
      .replace(/\\'''/g, "\\'" ); // remove non-escaped single-quote if there are enclosed between 2 escaped
  }
  return s;
}

if (isUsingWindows) {
  cleanInput = function(s) {
    var isPathName = /[\\]/.test(s);
    if (isPathName) {
      var dirname = '"' + path.dirname(s) + '"';
      var basename = '"' + path.basename(s) + '"';
      return dirname + ':' + basename;
    }
    return '"' + s + '"';
  }
}

module.exports = function commandExists(commandName, callback) {
  var cleanedCommandName = cleanInput(commandName);
  if (!callback && typeof Promise !== 'undefined') {
    return new Promise(function(resolve, reject){
      commandExists(commandName, function(error, output) {
        if (output) {
          resolve(commandName);
        } else {
          reject(error);
        }
      });
    });
  }
  if (isUsingWindows) {
    commandExistsWindows(commandName, cleanedCommandName, callback);
  } else {
    commandExistsUnix(commandName, cleanedCommandName, callback);
  }
};

module.exports.sync = function(commandName) {
  var cleanedCommandName = cleanInput(commandName);
  if (isUsingWindows) {
    return commandExistsWindowsSync(commandName, cleanedCommandName);
  } else {
    return commandExistsUnixSync(commandName, cleanedCommandName);
  }
};


/***/ }),

/***/ 250:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var spawn = __webpack_require__(129).spawn
var util = __webpack_require__(669)

var escapeSpaces = function(path) {
  if (typeof path === 'string') {
    return path.replace(/\b\s/g, '\\ ')
  } else {
    return path
  }
}

var escapeSpacesInOptions = function(options) {
  // Escape paths in the src, dest, include, exclude, and excludeFirst arguments
  ;['src', 'dest', 'include', 'exclude', 'excludeFirst'].forEach(function(
    optionKey
  ) {
    var option = options[optionKey]
    if (typeof option === 'string') {
      options[optionKey] = escapeSpaces(option)
    } else if (Array.isArray(option) === true) {
      options[optionKey] = option.map(escapeSpaces)
    }
  })

  return options
}

module.exports = function(options, callback) {
  options = options || {}
  options = util._extend({}, options)
  options = escapeSpacesInOptions(options)

  var platform = options.platform || process.platform // Enable process.platform to be mocked in options for testing
  var isWin = platform === 'win32'

  if (typeof options.src === 'undefined') {
    throw new Error("'src' directory is missing from options")
  }

  if (typeof options.dest === 'undefined') {
    throw new Error("'dest' directory is missing from options")
  }

  var dest = options.dest

  if (typeof options.host !== 'undefined') {
    dest = options.host + ':' + options.dest
  }

  if (!Array.isArray(options.src)) {
    options.src = [options.src]
  }

  var args = [].concat(options.src)

  args.push(dest)

  // [rsync failed on windows, copying persmissions](https://github.com/jedrichards/rsyncwrapper/issues/28)
  // [set chmod flag by default on Windows](https://github.com/jedrichards/rsyncwrapper/pull/29)
  var chmodArg = (options.args || []).find(function(arg) {
    return arg.match(/--chmod=/)
  })
  if (isWin && !chmodArg) {
    args.push('--chmod=ugo=rwX')
  }

  if (typeof options.host !== 'undefined' || options.ssh) {
    args.push('--rsh')
    var rshCmd = 'ssh'
    if (typeof options.port !== 'undefined') {
      rshCmd += ' -p ' + options.port
    }
    if (typeof options.privateKey !== 'undefined') {
      rshCmd += ' -i ' + options.privateKey
    }
    if (typeof options.sshCmdArgs !== 'undefined') {
      rshCmd += ' ' + options.sshCmdArgs.join(' ')
    }
    args.push(rshCmd)
  }

  if (options.recursive === true) {
    args.push('--recursive')
  }

  if (options.times === true) {
    args.push('--times')
  }

  if (options.syncDest === true || options.deleteAll === true) {
    args.push('--delete')
    args.push('--delete-excluded')
  }

  if (options.syncDestIgnoreExcl === true || options.delete === true) {
    args.push('--delete')
  }

  if (options.dryRun === true) {
    args.push('--dry-run')
    args.push('--verbose')
  }

  if (
    typeof options.excludeFirst !== 'undefined' &&
    util.isArray(options.excludeFirst)
  ) {
    options.excludeFirst.forEach(function(value, index) {
      args.push('--exclude=' + value)
    })
  }

  if (typeof options.include !== 'undefined' && util.isArray(options.include)) {
    options.include.forEach(function(value, index) {
      args.push('--include=' + value)
    })
  }

  if (typeof options.exclude !== 'undefined' && util.isArray(options.exclude)) {
    options.exclude.forEach(function(value, index) {
      args.push('--exclude=' + value)
    })
  }

  switch (options.compareMode) {
    case 'sizeOnly':
      args.push('--size-only')
      break
    case 'checksum':
      args.push('--checksum')
      break
  }

  if (typeof options.args !== 'undefined' && util.isArray(options.args)) {
    args = [...new Set([...args, ...options.args])]
  }

  args = [...new Set(args)]

  var noop = function() {}
  var onStdout = options.onStdout || noop
  var onStderr = options.onStderr || noop

  var cmd = 'rsync '
  args.forEach(function(arg) {
    if (arg.substr(0, 4) === 'ssh ') {
      arg = '"' + arg + '"'
    }
    cmd += arg + ' '
  })
  cmd = cmd.trim()

  if (options.noExec) {
    callback(null, null, null, cmd)
    return
  }

  try {
    var stdout = ''
    var stderr = ''
    // Launch cmd in a shell just like Node's child_process.exec() does:
    // see https://github.com/joyent/node/blob/937e2e351b2450cf1e9c4d8b3e1a4e2a2def58bb/lib/child_process.js#L589
    var child
    if (isWin) {
      child = spawn('cmd.exe', ['/s', '/c', '"' + cmd + '"'], {
        windowsVerbatimArguments: true,
        stdio: [process.stdin, 'pipe', 'pipe'],
      })
    } else {
      child = spawn('/bin/sh', ['-c', cmd])
    }

    child.stdout.on('data', function(data) {
      onStdout(data)
      stdout += data
    })

    child.stderr.on('data', function(data) {
      onStderr(data)
      stderr += data
    })

    child.on('exit', function(code) {
      var err = null
      if (code !== 0) {
        err = new Error('rsync exited with code ' + code)
        err.code = code
      }
      callback(err, stdout, stderr, cmd)
    })
  } catch (err) {
    callback(err, null, null, cmd)
  }
}


/***/ }),

/***/ 428:
/***/ (function(module, __unusedexports, __webpack_require__) {

var exec = __webpack_require__(129).exec;

var commandline={
    get:getString,
    run:runCommand
};

function runCommand(command){
    //return refrence to the child process
    return exec(
        command
    );
}

function getString(command,callback){
    //return refrence to the child process
    return exec(
        command,
        (
            function(){
                return function(err,data,stderr){
                    if(!callback)
                        return;

                    callback(err, data, stderr);
                }
            }
        )(callback)
    );
}

module.exports=commandline;


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 677:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(243);


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ },
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getter */
/******/ 	!function() {
/******/ 		// define getter function for harmony exports
/******/ 		var hasOwnProperty = Object.prototype.hasOwnProperty;
/******/ 		__webpack_require__.d = function(exports, name, getter) {
/******/ 			if(!hasOwnProperty.call(exports, name)) {
/******/ 				Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 			if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function getDefault() { return module['default']; } :
/******/ 				function getModuleExports() { return module; };
/******/ 			__webpack_require__.d(getter, 'a', getter);
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ }
);