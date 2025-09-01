#!/usr/bin/env node

/**
 * Unified Development Environment for LaunchKit AI
 * Orchestrates all services with health checking and smart restart
 */

import { spawn } from 'child_process';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Service configuration
 */
const SERVICES = [
  {
    name: 'API',
    command: 'cd apps/api && pnpm dev',
    healthCheck: 'http://localhost:3001/api/v1/healthz',
    port: 3001,
    color: '\x1b[32m', // Green
    essential: true,
  },
  {
    name: 'Web',
    command: 'cd apps/web && pnpm dev',
    healthCheck: 'http://localhost:3000',
    port: 3000,
    color: '\x1b[34m', // Blue
    essential: true,
  },
  {
    name: 'UI/Storybook',
    command: 'cd packages/ui && pnpm storybook',
    healthCheck: 'http://localhost:6006',
    port: 6006,
    color: '\x1b[35m', // Magenta
    essential: false,
  },
];

const RESET_COLOR = '\x1b[0m';

/**
 * Service process tracking
 */
const serviceProcesses = new Map();
const serviceStatus = new Map();

/**
 * Colored logging for each service
 */
function logService(serviceName, message, color) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${color}[${timestamp}] [${serviceName}]${RESET_COLOR} ${message}`);
}

/**
 * Health check for a service
 */
async function healthCheck(url) {
  try {
    const response = await fetch(url, { 
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Start a service with monitoring
 */
function startService(service) {
  logService(service.name, `Starting...`, service.color);
  
  const child = spawn('bash', ['-c', service.command], {
    stdio: 'pipe',
    env: { ...process.env },
  });

  // Service output handling
  child.stdout?.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      logService(service.name, output, service.color);
    }
  });

  child.stderr?.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      logService(service.name, `ERROR: ${output}`, '\x1b[31m'); // Red
    }
  });

  child.on('close', (code) => {
    logService(service.name, `Process exited with code ${code}`, service.color);
    serviceStatus.set(service.name, 'stopped');
    
    // Auto-restart essential services
    if (service.essential && code !== 0) {
      setTimeout(() => {
        logService(service.name, 'Restarting essential service...', service.color);
        startService(service);
      }, 2000);
    }
  });

  serviceProcesses.set(service.name, child);
  serviceStatus.set(service.name, 'starting');

  // Start health monitoring
  setTimeout(() => monitorService(service), 10000); // Wait 10s before first health check
}

/**
 * Monitor service health and restart if needed
 */
async function monitorService(service) {
  if (!serviceProcesses.has(service.name)) {
    return; // Service was stopped
  }

  const isHealthy = await healthCheck(service.healthCheck);
  const currentStatus = serviceStatus.get(service.name);

  if (isHealthy && currentStatus !== 'healthy') {
    serviceStatus.set(service.name, 'healthy');
    logService(service.name, '✅ Health check passed', service.color);
  } else if (!isHealthy && currentStatus === 'healthy') {
    serviceStatus.set(service.name, 'unhealthy');
    logService(service.name, '❌ Health check failed', '\x1b[31m');
    
    // Restart if essential
    if (service.essential) {
      logService(service.name, 'Restarting due to health check failure...', service.color);
      stopService(service.name);
      setTimeout(() => startService(service), 3000);
    }
  }

  // Schedule next health check
  setTimeout(() => monitorService(service), 30000); // Check every 30s
}

/**
 * Stop a service
 */
function stopService(serviceName) {
  const process = serviceProcesses.get(serviceName);
  if (process) {
    process.kill('SIGTERM');
    serviceProcesses.delete(serviceName);
    serviceStatus.set(serviceName, 'stopped');
    logService(serviceName, 'Stopped', '\x1b[33m'); // Yellow
  }
}

/**
 * Stop all services gracefully
 */
function stopAllServices() {
  console.log('\n🛑 Stopping all services...');
  for (const serviceName of serviceProcesses.keys()) {
    stopService(serviceName);
  }
  
  setTimeout(() => {
    console.log('👋 Development environment stopped');
    process.exit(0);
  }, 2000);
}

/**
 * Development environment status dashboard
 */
function createStatusDashboard() {
  const server = createServer((req, res) => {
    if (req.url === '/') {
      const status = Array.from(serviceStatus.entries()).map(([name, status]) => {
        const service = SERVICES.find(s => s.name === name);
        return {
          name,
          status,
          port: service?.port,
          healthCheck: service?.healthCheck,
          essential: service?.essential,
        };
      });

      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>LaunchKit AI - Development Status</title>
  <meta http-equiv="refresh" content="5">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .service { padding: 10px; margin: 10px 0; border-left: 4px solid #ddd; background: #f9f9f9; }
    .healthy { border-color: #4CAF50; }
    .unhealthy { border-color: #f44336; }
    .starting { border-color: #ff9800; }
    .stopped { border-color: #9e9e9e; }
    .status { font-weight: bold; text-transform: uppercase; }
    .port { color: #666; font-size: 0.9em; }
    h1 { color: #333; }
    .timestamp { color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 LaunchKit AI - Development Environment</h1>
    <p class="timestamp">Last updated: ${new Date().toLocaleString()}</p>
    
    ${status.map(service => `
      <div class="service ${service.status}">
        <div class="status">${service.name}: ${service.status}</div>
        <div class="port">Port: ${service.port} | Essential: ${service.essential ? 'Yes' : 'No'}</div>
        ${service.status === 'healthy' ? `<a href="${service.healthCheck}" target="_blank">Health Check</a>` : ''}
      </div>
    `).join('')}
    
    <h2>🔗 Quick Links</h2>
    <ul>
      <li><a href="http://localhost:3000" target="_blank">Web Application</a></li>
      <li><a href="http://localhost:3001/api/v1/healthz" target="_blank">API Health</a></li>
      <li><a href="http://localhost:6006" target="_blank">Storybook</a></li>
    </ul>
  </div>
</body>
</html>`;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else if (req.url === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(Object.fromEntries(serviceStatus)));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(9000, () => {
    logService('Dashboard', 'Status dashboard available at http://localhost:9000', '\x1b[36m'); // Cyan
  });
}

/**
 * Display startup banner
 */
function showBanner() {
  console.log('\x1b[36m'); // Cyan
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║         🚀 LaunchKit AI Dev Environment      ║');
  console.log('║                                              ║');
  console.log('║  Starting all services with health checks   ║');
  console.log('║  Dashboard: http://localhost:9000           ║');
  console.log('║                                              ║');
  console.log('║  Press Ctrl+C to stop all services          ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('\x1b[0m\n'); // Reset
}

/**
 * Main development environment orchestrator
 */
async function main() {
  const args = process.argv.slice(2);
  const serviceFilter = args.find(arg => arg.startsWith('--services='))?.split('=')[1];
  const skipHealthChecks = args.includes('--no-health-checks');

  showBanner();

  // Filter services if specified
  let servicesToStart = SERVICES;
  if (serviceFilter) {
    const requestedServices = serviceFilter.split(',');
    servicesToStart = SERVICES.filter(service => 
      requestedServices.some(requested => 
        service.name.toLowerCase().includes(requested.toLowerCase())
      )
    );
  }

  // Create status dashboard
  if (!args.includes('--no-dashboard')) {
    createStatusDashboard();
  }

  // Start all services
  for (const service of servicesToStart) {
    startService(service);
    // Stagger startup to avoid port conflicts
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Graceful shutdown handling
  process.on('SIGINT', stopAllServices);
  process.on('SIGTERM', stopAllServices);

  // Keep process alive
  process.stdin.resume();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
