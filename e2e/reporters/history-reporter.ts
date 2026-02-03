import { Reporter, FullResult, Suite, TestCase } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface FailureRecord {
    testName: string;
    project: string;
    location: string;
    status: 'failed' | 'timedOut' | 'interrupted';
    error?: string;
}

interface TestRun {
    timestamp: string;
    branch: string;
    passedCount: number;
    failedCount: number;
    timedOutCount: number;
    skippedCount: number;
    failures: FailureRecord[];
}

interface HistoryData {
    runs: TestRun[];
}

class HistoryReporter implements Reporter {
    private suite?: Suite;

    onBegin(config: any, suite: Suite) {
        this.suite = suite;
    }

    async onEnd(result: FullResult) {
        if (!this.suite) return;

        const historyDir = path.join(process.cwd(), 'data');
        const historyPath = path.join(historyDir, 'test-history.json');

        if (!fs.existsSync(historyDir)) {
            fs.mkdirSync(historyDir, { recursive: true });
        }

        let branch = 'unknown';
        try {
            branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        } catch (e) {
            // Not a git repo or git not installed
        }

        const tests = this.suite.allTests();
        const failures: FailureRecord[] = [];
        let passedCount = 0;
        let failedCount = 0;
        let timedOutCount = 0;
        let skippedCount = 0;

        for (const test of tests) {
            const result = test.results[0]; // Take the first result
            const status = result?.status;

            if (status === 'passed') {
                passedCount++;
            } else if (status === 'failed' || status === 'timedOut' || status === 'interrupted') {
                if (status === 'failed') failedCount++;
                if (status === 'timedOut') timedOutCount++;

                failures.push({
                    testName: test.title,
                    project: test.parent.project()?.name || 'Unknown',
                    location: `${test.location.file}:${test.location.line}`,
                    status: status,
                    error: result.error?.message?.split('\n')[0] // Just the first line of the error
                });
            } else if (status === 'skipped') {
                skippedCount++;
            }
        }

        const newRun: TestRun = {
            timestamp: new Date().toISOString(),
            branch,
            passedCount,
            failedCount,
            timedOutCount,
            skippedCount,
            failures: failures
        };

        let history: HistoryData = { runs: [] };
        if (fs.existsSync(historyPath)) {
            try {
                history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
            } catch (e) {
                console.error('Failed to parse history JSON, starting fresh.');
            }
        }

        // Add new run
        history.runs.push(newRun);

        // Apply 3-month retention policy (90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        history.runs = history.runs.filter(run => {
            const runDate = new Date(run.timestamp);
            return runDate >= ninetyDaysAgo;
        });

        fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
        console.log(`\nTest results stored to ${historyPath} (${failedCount} failures recorded)`);
    }
}

export default HistoryReporter;
