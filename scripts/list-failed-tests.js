const fs = require('fs');

try {
    const reportPath = process.argv[2];
    if (!fs.existsSync(reportPath)) {
        console.log("Report file not found");
        process.exit(0);
    }

    // Read as buffer to check BOM
    const buffer = fs.readFileSync(reportPath);
    let content;

    // Check for UTF-16 LE BOM (FF FE)
    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
        content = buffer.toString('utf16le');
    } else {
        content = buffer.toString('utf8');
    }

    // Strip BOM if present (needed even after decoding)
    content = content.replace(/^\uFEFF/, '');

    const report = JSON.parse(content);

    function getFailedTests(suite) {
        let failures = [];
        if (suite.specs) {
            for (const spec of suite.specs) {
                const failed = spec.tests.some(t => t.results.some(r => r.status === 'failed' || r.status === 'timedOut'));
                if (failed) {
                    failures.push(spec.title);
                }
            }
        }
        if (suite.suites) {
            for (const child of suite.suites) {
                failures = failures.concat(getFailedTests(child));
            }
        }
        return failures;
    }

    let allFailures = [];
    if (report.suites) {
        for (const rootSuite of report.suites) {
            allFailures = allFailures.concat(getFailedTests(rootSuite));
        }
    }

    // Deduplicate and sort
    const uniqueFailures = [...new Set(allFailures)].sort();

    if (uniqueFailures.length === 0) {
        console.log("No failures found");
    } else {
        console.log(uniqueFailures.join('\n'));
    }

} catch (e) {
    console.error("Error parsing report:", e.message);
}
