import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import { logger } from './logger';
import { installDependencies, detectPackageManager, type PackageManager } from './packageManager';

export interface CreateProjectOptions {
    projectName: string;
    template: 'basic' | 'typescript';
    skipInstall?: boolean;
}

export async function createProject(options: CreateProjectOptions): Promise<boolean> {
    const { projectName, template, skipInstall = false } = options;
    const projectPath = path.join(process.cwd(), projectName);

    try {
        // Check if directory already exists
        if (fs.existsSync(projectPath)) {
            logger.error(`Directory "${projectName}" already exists`);
            return false;
        }

        // Create project directory
        logger.step('Creating project directory...');
        fs.mkdirSync(projectPath, { recursive: true });

        // Get template path
        const templatePath = path.join(__dirname, '../../templates', template);

        if (!fs.existsSync(templatePath)) {
            logger.error(`Template "${template}" not found`);
            return false;
        }

        // Copy template files
        logger.step('Copying template files...');
        fs.copySync(templatePath, projectPath);

        // Update package.json with project name
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = fs.readJsonSync(packageJsonPath);
            packageJson.name = projectName;
            fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
        }

        // Initialize git repository
        try {
            logger.step('Initializing git repository...');
            execSync('git init', { cwd: projectPath, stdio: 'ignore' });

            // Create .gitignore if it doesn't exist
            const gitignorePath = path.join(projectPath, '.gitignore');
            if (!fs.existsSync(gitignorePath)) {
                fs.writeFileSync(gitignorePath, 'node_modules\n*.log\n.DS_Store\ndist\n');
            }
        } catch (error) {
            logger.warning('Failed to initialize git repository');
        }

        // Install dependencies
        if (!skipInstall) {
            const packageManager = detectPackageManager();
            const installed = installDependencies(projectPath, packageManager);

            if (!installed) {
                logger.warning('You can install dependencies manually later');
            }
        }

        return true;
    } catch (error) {
        logger.error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);

        // Clean up on failure
        if (fs.existsSync(projectPath)) {
            try {
                fs.removeSync(projectPath);
            } catch {
                // Ignore cleanup errors
            }
        }

        return false;
    }
}
