import { execSync } from 'child_process';
import { logger } from './logger';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export function detectPackageManager(): PackageManager {
    try {
        execSync('pnpm --version', { stdio: 'ignore' });
        return 'pnpm';
    } catch {
        // pnpm not available
    }

    try {
        execSync('yarn --version', { stdio: 'ignore' });
        return 'yarn';
    } catch {
        // yarn not available
    }

    return 'npm';
}

export function installDependencies(projectPath: string, packageManager: PackageManager): boolean {
    try {
        logger.step(`Installing dependencies with ${packageManager}...`);

        const installCommand = packageManager === 'yarn' ? 'yarn install' : `${packageManager} install`;

        execSync(installCommand, {
            cwd: projectPath,
            stdio: 'inherit'
        });

        return true;
    } catch (error) {
        logger.error('Failed to install dependencies');
        return false;
    }
}

export function getInstallCommand(packageManager: PackageManager): string {
    switch (packageManager) {
        case 'pnpm':
            return 'pnpm install';
        case 'yarn':
            return 'yarn';
        default:
            return 'npm install';
    }
}

export function getRunCommand(packageManager: PackageManager, script: string): string {
    switch (packageManager) {
        case 'pnpm':
            return `pnpm ${script}`;
        case 'yarn':
            return `yarn ${script}`;
        default:
            return `npm run ${script}`;
    }
}
