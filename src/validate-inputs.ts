import * as core from '@actions/core';

interface Inputs {
  [key: string]: any;
};

export const validateInputs = (inputs: Inputs) => {
  const inputKeys = Object.keys(inputs);
  const validInputs = inputKeys.filter(inputKey => {
    const inputValue = inputs[inputKey];

    if (!inputValue) {
      core.error(`⚠️ [INPUTS] ${inputKey} is mandatory.`);
    }

    return inputValue;
  });

  if (validInputs.length !== inputKeys.length) {
    core.setFailed(`⚠️ [INPUTS] Inputs not valid, aborting.`);
    process.exit();
  }
};
