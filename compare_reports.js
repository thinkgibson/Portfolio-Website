const fs = require('fs');

try {
    const baseline = JSON.parse(fs.readFileSync('baseline-results.json.bak', 'utf8'));
    const current = JSON.parse(fs.readFileSync('current-results.json', 'utf8'));

    function getStats(report) {
        let total = 0;
        let passed = 0;
        let failed = 0;
        let skipped = 0;

        report.suites.forEach(suite => {
            suite.specs.forEach(spec => {
                spec.tests.forEach(test => {
                    total++;
                    if (test.status === 'expected') passed++;
                    else if (test.status === 'unexpected') failed++;
                    else if (test.status === 'skipped') skipped++;
                });
            });
        });
        return { total, passed, failed, skipped };
    }

    // Simplified stats extraction - structure might be recursive
    // Better to just count leaf tests
    function countTests(suite) {
        let stats = { total: 0, passed: 0, failed: 0, skipped: 0 };
        if (suite.specs) {
            suite.specs.forEach(spec => {
                spec.tests.forEach(test => {
                    stats.total++;
                    // status: 'expected', 'unexpected', 'flaky', 'skipped'
                    // outcome: 'expected', 'unexpected', 'flaky', 'skipped'
                    if (test.outcome === 'expected') stats.passed++;
                    else if (test.outcome === 'unexpected') stats.failed++;
                    else if (test.outcome === 'skipped') stats.skipped++;
                });
            });
        }
        if (suite.suites) {
            suite.suites.forEach(child => {
                const childStats = countTests(child);
                stats.total += childStats.total;
                stats.passed += childStats.passed;
                stats.failed += childStats.failed;
                stats.skipped += childStats.skipped;
            });
        }
        return stats;
    }

    const baselineStats = countTests(baseline);
    const currentStats = countTests(current);

    console.log('Baseline:', baselineStats);
    console.log('Current: ', currentStats);

    if (currentStats.failed > baselineStats.failed) {
        console.log('REGRESSION DETECTED: More failures in current than baseline.');
    } else if (currentStats.passed < baselineStats.passed) {
        console.log('REGRESSION DETECTED: Fewer passes in current than baseline.');
    } else {
        console.log('NO REGRESSION DETECTED.');
    }

} catch (e) {
    console.error('Error comparing reports:', e);
}
