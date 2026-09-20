import { copyFileSync, writeFileSync } from 'node:fs'

// GitHub Pages has no rewrite rule, so it serves 404.html for any path that is
// not a real file. Making that a copy of index.html lets deep links such as
// /cre8x/journey/j1 boot the SPA instead of showing a 404.
copyFileSync('dist/index.html', 'dist/404.html')

// Stop Pages running the output through Jekyll.
writeFileSync('dist/.nojekyll', '')

console.log('spa-fallback: wrote dist/404.html and dist/.nojekyll')
