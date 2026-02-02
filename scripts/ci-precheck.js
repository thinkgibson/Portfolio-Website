const fs = require('fs');
const net = require('net');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 3002;
const BUILD_DIR = path.join(__dirname, '..', '.next');

console.log('Running CI Pre-checks...');

// 1. Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Build directory (.next) not found. Run "npm run build" first.');
    process.exit(1);
}
console.log('✅ Build directory exists.');

// 2. Kill any existing process on port 3001
console.log(`🔄 Checking for existing processes on port ${PORT}...`);
try {
    if (process.platform === 'win32') {
        // Windows: find and kill process using port
        try {
            const result = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
            const lines = result.trim().split('\n');
            const pids = new Set();
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && !isNaN(parseInt(pid))) {
                    pids.add(pid);
                }
            });
            pids.forEach(pid => {
                try {
                    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                    console.log(`   Killed process ${pid}`);
                } catch (e) {
                    // Process may have already exited
                }
            });
            if (pids.size > 0) {
                console.log(`✅ Cleaned up ${pids.size} existing process(es) on port ${PORT}.`);
            }
        } catch (e) {
            // No process found on port - this is fine
        }
    } else {
        // Unix: use lsof and kill
        try {
            const result = execSync(`lsof -ti:${PORT}`, { encoding: 'utf8' });
            const pids = result.trim().split('\n').filter(p => p);
            pids.forEach(pid => {
                try {
                    execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
                    console.log(`   Killed process ${pid}`);
                } catch (e) {
                    // Process may have already exited
                }
            });
            if (pids.length > 0) {
                console.log(`✅ Cleaned up ${pids.length} existing process(es) on port ${PORT}.`);
            }
        } catch (e) {
            // No process found on port - this is fine
        }
    }
} catch (e) {
    console.log(`⚠️ Could not check for existing processes: ${e.message}`);
}

// 3. Verify port is now free
const server = net.createServer();

server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is still in use after cleanup. Please stop any running instance manually.`);
        process.exit(1);
    }
    console.error(`❌ Error checking port usage: ${err.message}`);
    process.exit(1);
});

server.once('listening', () => {
    server.close();
    console.log(`✅ Port ${PORT} is free.`);
    process.exit(0);
});

server.listen(PORT);

