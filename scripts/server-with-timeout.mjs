import { spawn, exec } from 'child_process';
import readline from 'readline';

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const PORT = 3001;
const HOST = '127.0.0.1';

let lastActivity = Date.now();
let serverProcess = null;

function log(msg) {
    console.log(`[ServerManager] ${msg}`);
}



// Setup activity monitoring
// Note: In a real production environment, we'd use a proxy to track HTTP requests.
// For this local helper, we'll monitor terminal input as "activity" and also provide the stop command.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function displayControlPanel() {
    console.log('\n' + '='.repeat(50));
    console.log('       🚀 SERVER CONTROL PANEL 🚀');
    console.log('='.repeat(50));
    console.log(` SITE URL: http://${HOST}:${PORT}`);
    console.log('-'.repeat(50));
    console.log(' > Type "stop" and hit ENTER to shutdown the site');
    console.log(' > Press any key + ENTER to reset the 5min timeout');
    console.log('-'.repeat(50));
    console.log('='.repeat(50) + '\n');
}

function startServer() {
    log(`Starting Next.js server on http://${HOST}:${PORT}...`);

    serverProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString(), '--hostname', HOST], {
        shell: true,
        stdio: 'inherit'
    });

    serverProcess.on('exit', (code) => {
        log(`Server process exited with code ${code}`);
        process.exit(code || 0);
    });

    // Display the control panel after a short delay to ensure it appears after startup logs
    setTimeout(displayControlPanel, 3000);
}

function checkTimeout() {
    const idleTime = Date.now() - lastActivity;
    if (idleTime >= TIMEOUT_MS) {
        log('Inactivity timeout reached (5 minutes). Shutting down...');
        shutdown();
    }
}

function shutdown() {
    if (serverProcess) {
        log('Stopping server...');
        if (process.platform === 'win32') {
            exec(`taskkill /pid ${serverProcess.pid} /T /F`, (err) => {
                if (err) {
                    log(`Error stopping server: ${err.message}`);
                }
                process.exit(0);
            });
        } else {
            serverProcess.kill();
            process.exit(0);
        }
    } else {
        process.exit(0);
    }
}

rl.on('line', (line) => {
    lastActivity = Date.now();
    const cmd = line.trim().toLowerCase();
    if (cmd === 'stop' || cmd === 'exit' || cmd === 'quit') {
        shutdown();
    } else if (line.trim() !== '') {
        log('Activity detected. Timeout reset.');
    }
});

// Periodic timeout check
setInterval(checkTimeout, 30000); // Check every 30 seconds

startServer();
