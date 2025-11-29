#!/usr/bin/env node

import prompts from 'prompts';
import validatePackageName from 'validate-npm-package-name';
import { logger } from './utils/logger';
import { createProject } from './utils/createProject';
import { detectPackageManager, getRunCommand } from './utils/packageManager';
import * as path from 'path';

async function main() {
    logger.title('🚀 Create Apexo App');

    // Get project name from arguments or prompt
    let projectName = process.argv[2];

    if (!projectName) {
        const response = await prompts({
            type: 'text',
            name: 'projectName',
            message: 'What is your project name?',
            initial: 'my-apexo-app',
            validate: (value) => {
                const validation = validatePackageName(value);
                if (!validation.validForNewPackages) {
                    return validation.errors?.[0] || 'Invalid package name';
                }
                return true;
            }
        });

        if (!response.projectName) {
            logger.error('Project name is required');
            process.exit(1);
        }

        projectName = response.projectName;
    } else {
        // Validate project name from arguments
        const validation = validatePackageName(projectName);
        if (!validation.validForNewPackages) {
            logger.error(`Invalid project name: ${validation.errors?.[0] || 'Unknown error'}`);
            process.exit(1);
        }
    }

    // Select template
    const templateResponse = await prompts({
        type: 'select',
        name: 'template',
        message: 'Select a template:',
        choices: [
            { title: 'Basic (JavaScript)', value: 'basic' },
            { title: 'TypeScript', value: 'typescript' }
        ],
        initial: 0
    });

    if (!templateResponse.template) {
        logger.error('Template selection is required');
        process.exit(1);
    }

    const template = templateResponse.template as 'basic' | 'typescript';

    // Create project
    logger.log('');
    const success = await createProject({
        projectName,
        template,
        skipInstall: false
    });

    if (!success) {
        process.exit(1);
    }

    // Success message
    const packageManager = detectPackageManager();
    logger.log('');
    logger.success(`Successfully created project "${projectName}"!`);
    logger.log('');
    logger.info('Next steps:');
    logger.log('');
    logger.step(`cd ${projectName}`);

    if (template === 'typescript') {
        logger.step(getRunCommand(packageManager, 'build'));
        logger.step(getRunCommand(packageManager, 'start'));
    } else {
        logger.step('node index.js');
    }

    logger.log('');
    logger.info('Happy coding! 🎉');
    logger.log('');
}

main().catch((error) => {
    logger.error(`An error occurred: ${error.message}`);
    process.exit(1);
});
