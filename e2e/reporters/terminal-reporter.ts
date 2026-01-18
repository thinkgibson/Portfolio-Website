import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class TerminalReporter implements Reporter {
    onTestEnd(test: TestCase, result: TestResult) {
        const rawStatus = result.status;
        let status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

        // ANSI color codes
        const colors: Record<string, string> = {
            passed: '\x1b[32m',
            failed: '\x1b[31m',
            skipped: '\x1b[33m',
            timedOut: '\x1b[31m',
            interrupted: '\x1b[31m',
            reset: '\x1b[0m'
        };

        const color = colors[rawStatus] || colors.reset;
        const title = test.title;
        const project = test.parent.project()?.name || 'Unknown';
        const formattedProject = `[${project.charAt(0).toUpperCase() + project.slice(1)}]`;

        console.log(`${formattedProject} ${title} - ${color}${status}${colors.reset}`);
    }
}

export default TerminalReporter;
