const fs = require('fs');

function findFailedRecursive(suite, failed = []) {
    if (suite.specs) {
        suite.specs.forEach(spec => {
            const result = spec.tests[0].results[spec.tests[0].results.length - 1];
            if (result.status === 'failed' || result.status === 'timedOut') {
                failed.push(spec.title);
            }
        });
    }
    if (suite.suites) {
        suite.suites.forEach(s => findFailedRecursive(s, failed));
    }
    return failed;
}

const file = process.argv[2];
try {
    let raw = fs.readFileSync(file);
    let data;
    // Detect UTF-16LE BOM (FF FE)
    if (raw[0] === 0xFF && raw[1] === 0xFE) {
        data = raw.toString('utf16le');
    } else {
        data = raw.toString('utf8');
    }
    // Remove BOM character if present
    if (data.charCodeAt(0) === 0xFEFF) {
        data = data.slice(1);
    }

    const json = JSON.parse(data);
    const failures = [];
    json.suites.forEach(rootSuite => {
        findFailedRecursive(rootSuite, failures);
    });

    if (failures.length === 0) {
        console.log(`No failures in ${file}`);
    } else {
        console.log(`Failures in ${file} (${failures.length}):`);
        failures.forEach(f => console.log(` - ${f}`));
    }
} catch (e) {
    console.error(`Error reading ${file}:`, e.message);
}
