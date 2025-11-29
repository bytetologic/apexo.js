import chalk from 'chalk';

export const logger = {
    success: (message: string) => {
        console.log(chalk.green('✓'), message);
    },

    error: (message: string) => {
        console.log(chalk.red('✗'), message);
    },

    info: (message: string) => {
        console.log(chalk.blue('ℹ'), message);
    },

    warning: (message: string) => {
        console.log(chalk.yellow('⚠'), message);
    },

    log: (message: string) => {
        console.log(message);
    },

    title: (message: string) => {
        console.log(chalk.bold.cyan(`\n${message}\n`));
    },

    step: (message: string) => {
        console.log(chalk.dim('→'), message);
    }
};
