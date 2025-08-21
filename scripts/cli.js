#!/usr/bin/env node

const program = require('commander');
const { exec } = require('child_process');

program
  .command('run')
  .description('Run a task')
  .option('--task <description>', 'The task to run')
  .action((options) => {
    console.log(`Running task: ${options.task}`);
    const buildLoop = exec('bash scripts/build-loop.sh');

    buildLoop.stdout.on('data', (data) => {
      console.log(data);
    });

    buildLoop.stderr.on('data', (data) => {
      console.error(data);
    });

    buildLoop.on('close', (code) => {
      console.log(`Build loop finished with code ${code}`);
    });
  });

program.parse(process.argv);