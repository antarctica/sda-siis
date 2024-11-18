import { defineConfig } from 'taze';

export default defineConfig({
  // fetch latest package info from registry without cache
  force: true,
  // do not automatically write to package.json
  write: false,
  // run `npm install` or `yarn install` right after bumping
  install: true,
  ignorePaths: ['**/node_modules/**'],
});
