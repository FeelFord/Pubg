import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

const source = resolve('out');
if (!existsSync(join(source, 'index.html'))) throw new Error('Run npm run build:pages first.');
const git = (args, cwd = process.cwd()) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const remote = git(['remote', 'get-url', 'origin']);
const author = { name: git(['config', 'user.name']), email: git(['config', 'user.email']) };
// Clone only the deployment branch into a disposable directory, preserving the source checkout.
const directory = mkdtempSync(join(tmpdir(), 'pubg-pages-'));
try {
  const branch = git(['ls-remote', '--heads', 'origin', 'refs/heads/gh-pages']);
  if (branch) git(['clone', '--single-branch', '--branch', 'gh-pages', remote, directory]);
  else {
    git(['init', '--initial-branch=gh-pages', directory]);
    git(['remote', 'add', 'origin', remote], directory);
  }
  for (const entry of readdirSync(directory)) {
    if (entry !== '.git') rmSync(join(directory, entry), { recursive: true, force: true });
  }
  cpSync(source, directory, { recursive: true });
  writeFileSync(join(directory, '.nojekyll'), '');
  git(['config', 'user.name', author.name], directory);
  git(['config', 'user.email', author.email], directory);
  git(['add', '--all'], directory);
  if (!git(['status', '--porcelain'], directory)) {
    console.log('The deployment branch is already up to date.');
  } else {
    git(['commit', '-m', 'Deploy PUBG website to GitHub Pages'], directory);
    // A normal push preserves existing branch history and refuses conflicting remote changes.
    git(['push', 'origin', 'HEAD:refs/heads/gh-pages'], directory);
    console.log('Static website pushed to gh-pages.');
  }
  console.log('Enable Settings → Pages → Deploy from a branch → gh-pages / (root).');
  console.log('Expected address after GitHub finishes deployment: https://feelford.github.io/Pubg/');
} finally {
  rmSync(directory, { recursive: true, force: true });
}
