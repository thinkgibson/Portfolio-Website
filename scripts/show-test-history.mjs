import fs from 'fs';
import path from 'path';

const historyPath = path.join(process.cwd(), 'data', 'test-history.json');

if (!fs.existsSync(historyPath)) {
    console.log('No test history found. Run `npm run test:e2e` first.');
    process.exit(0);
}

let history;
try {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
} catch (e) {
    console.error('Failed to read test history.');
    process.exit(1);
}

if (!history.runs || history.runs.length === 0) {
    console.log('No test runs recorded.');
    process.exit(0);
}

const lastRun = history.runs[history.runs.length - 1];
if (lastRun.failures.length === 0) {
    console.log('\x1b[32mAll tests passed in the latest run! (' + new Date(lastRun.timestamp).toLocaleString() + ')\x1b[0m');
    process.exit(0);
}

const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
};

console.log(`\nFound ${lastRun.failures.length} issues in the latest run (${new Date(lastRun.timestamp).toLocaleDateString()} ${formatTime(lastRun.timestamp)}):\n`);

const headers = ['Test Case', 'Project', 'Status', 'Started Failing', 'Branch'];
const colWidths = [45, 15, 10, 15, 30];

const pad = (str, width) => {
    const s = String(str);
    return s.length > width ? s.substring(0, width - 3) + '...' : s.padEnd(width);
};

// Print Header
console.log(headers.map((h, i) => pad(h, colWidths[i])).join(' | '));
console.log(colWidths.map(w => '-'.repeat(w)).join('-+-'));

lastRun.failures.forEach(failure => {
    // Find when it started failing
    let startedFailingAt = lastRun;
    for (let i = history.runs.length - 2; i >= 0; i--) {
        const run = history.runs[i];
        const matchingFailure = run.failures.find(f => f.testName === failure.testName && f.project === failure.project);
        if (matchingFailure) {
            startedFailingAt = run;
        } else {
            break;
        }
    }

    const row = [
        failure.testName,
        failure.project,
        failure.status || 'failed',
        formatTime(startedFailingAt.timestamp),
        startedFailingAt.branch
    ];

    const color = failure.status === 'timedOut' ? '\x1b[33m' : '\x1b[31m'; // Yellow for timeouts, Red for others
    console.log(`${color}${row.map((val, i) => pad(val, colWidths[i])).join(' | ')}\x1b[0m`);
});
