/**
 * Intelligent Test Router for LaunchKit AI
 * Automatically detects changed files and routes to appropriate test commands
 */

import { execSync, spawn } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Package-specific test routing configuration
 */
const TEST_TARGETS = [
  {
    package: '@launchkit-ai/api',
    command: 'pnpm test:api',
    patterns: ['apps/api/**', 'packages/sdk/**', 'packages/common/**'],
    dependencies: ['@launchkit-ai/sdk', '@launchkit-ai/common']
  },
  {
    package: '@launchkit-ai/sdk', 
    command: 'pnpm test:sdk',
    patterns: ['packages/sdk/**', 'packages/common/**'],
    dependencies: ['@launchkit-ai/common']
  },
  {
    package: '@launchkit-ai/ui',
    command: 'pnpm test:ui',
    patterns: ['packages/ui/**', 'packages/common/**'],
    dependencies: ['@launchkit-ai/common']
  },
  {
    package: '@launchkit-ai/web',
    command: 'pnpm test:web',
    patterns: ['apps/web/**', 'packages/ui/**', 'packages/sdk/**', 'packages/common/**'],
    dependencies: ['@launchkit-ai/ui', '@launchkit-ai/sdk', '@launchkit-ai/common']
  },
  {
    package: '@launchkit-ai/common',
    command: 'pnpm test:common',
    patterns: ['packages/common/**']
  },
];

/**
 * Get changed files since last commit or specified base
 */
function getChangedFiles(base = 'HEAD~1') {
  try {
    const output = execSync(`git diff --name-only ${base}`, { encoding: 'utf-8' });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.warn('Could not detect changed files, running all tests');
    return [];
  }
}

/**
 * Check if any pattern matches the given file path
 */
function matchesPatterns(filePath, patterns) {
  return patterns.some(pattern => {
    const glob = pattern.replace('**', '.*').replace('*', '[^/]*');
    const regex = new RegExp(`^${glob}`);
    return regex.test(filePath);
  });
}

/**
 * Determine which test targets need to run based on changed files
 */
function determineTestTargets(changedFiles) {
  if (changedFiles.length === 0) {
    return TEST_TARGETS; // Run all tests if no changes detected
  }

  const targets = new Set();

  for (const file of changedFiles) {
    for (const target of TEST_TARGETS) {
      if (matchesPatterns(file, target.patterns)) {
        targets.add(target);
        
        // Add dependent packages
        if (target.dependencies) {
          for (const dep of target.dependencies) {
            const depTarget = TEST_TARGETS.find(t => t.package === dep);
            if (depTarget) {
              targets.add(depTarget);
            }
          }
        }
      }
    }
  }

  return Array.from(targets);
}

/**
 * Run tests in parallel for independent packages
 */
async function runTestsParallel(targets) {
  const processes = targets.map(target => {
    console.log(`🧪 Running tests for ${target.package}...`);
    
    return new Promise((resolve) => {
      const child = spawn('bash', ['-c', target.command], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let output = '';
      child.stdout?.on('data', (data) => {
        output += data.toString();
        process.stdout.write(`[${target.package}] ${data}`);
      });

      child.stderr?.on('data', (data) => {
        output += data.toString();
        process.stderr.write(`[${target.package}] ${data}`);
      });

      child.on('close', (code) => {
        resolve({
          package: target.package,
          success: code === 0,
          output
        });
      });
    });
  });

  const results = await Promise.all(processes);
  
  console.log('\n📊 Test Results Summary:');
  console.log('=' .repeat(50));
  
  let allPassed = true;
  for (const result of results) {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} ${result.package}`);
    if (!result.success) {
      allPassed = false;
    }
  }

  if (!allPassed) {
    console.error('\n💥 Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

/**
 * Main test router function
 */
async function main() {
  const args = process.argv.slice(2);
  const base = args.find(arg => arg.startsWith('--base='))?.split('=')[1] || 'HEAD~1';
  const watch = args.includes('--watch');
  const coverage = args.includes('--coverage');
  const pattern = args.find(arg => arg.startsWith('--pattern='))?.split('=')[1];

  console.log('🔍 LaunchKit AI Intelligent Test Router');
  console.log('=' .repeat(40));

  if (pattern) {
    // Run tests matching specific pattern
    const targets = TEST_TARGETS.filter(target => target.package.includes(pattern));
    if (targets.length === 0) {
      console.error(`No test targets found matching pattern: ${pattern}`);
      process.exit(1);
    }
    await runTestsParallel(targets);
    return;
  }

  if (watch) {
    console.log('⏱️  Running in watch mode - monitoring file changes...');
    execSync('pnpm test:watch', { stdio: 'inherit' });
    return;
  }

  if (coverage) {
    console.log('📊 Running tests with coverage...');
    execSync('pnpm test:coverage', { stdio: 'inherit' });
    return;
  }

  // Smart test routing based on changed files
  const changedFiles = getChangedFiles(base);
  console.log(`📁 Changed files (since ${base}):`, changedFiles.length);
  if (changedFiles.length > 0 && changedFiles.length < 10) {
    changedFiles.forEach(file => console.log(`   ${file}`));
  }

  const targets = determineTestTargets(changedFiles);
  console.log(`🎯 Test targets determined:`, targets.map(t => t.package));

  await runTestsParallel(targets);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { determineTestTargets, runTestsParallel };
