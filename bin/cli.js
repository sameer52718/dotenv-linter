#!/usr/bin/env node

const yargs = require('yargs');
const DotenvLinter = require('../index');

const argv = yargs
  .option('env', {
    alias: 'e',
    describe: 'Path to .env file',
    default: '.env',
    type: 'string',
  })
  .option('example', {
    alias: 'x',
    describe: 'Path to .env.example file',
    default: '.env.example',
    type: 'string',
  })
  .option('check-empty', {
    describe: 'Check for empty values in .env file',
    type: 'boolean',
    default: false,
  })
  .option('create-example', {
    describe: 'Create .env.example from .env file',
    type: 'boolean',
    default: false,
  })
  .help()
  .argv;

const linter = new DotenvLinter({ checkEmptyValues: argv.checkEmpty });

if (argv.createExample) {
  try {
    const result = linter.createExampleFile(argv.env, argv.example);
    console.log(result);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
} else {
  const results = linter.lint(argv.env, argv.example);

  if (results.missingVariables.length > 0) {
    console.log('Missing variables:');
    results.missingVariables.forEach(varName => console.log(`- ${varName}`));
  }

  if (results.extraVariables.length > 0) {
    console.log('\nExtra variables:');
    results.extraVariables.forEach(varName => console.log(`- ${varName}`));
  }

  if (results.duplicateKeys.length > 0) {
    console.log('\nDuplicate keys:');
    results.duplicateKeys.forEach(({ key, line }) => console.log(`- ${key} on line ${line}`));
  }

  if (results.emptyValues.length > 0) {
    console.log('\nEmpty values:');
    results.emptyValues.forEach(varName => console.log(`- ${varName}`));
  }

  if (
    results.missingVariables.length === 0 &&
    results.extraVariables.length === 0 &&
    results.duplicateKeys.length === 0 &&
    results.emptyValues.length === 0
  ) {
    console.log('No issues found!');
  }
}