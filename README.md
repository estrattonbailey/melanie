# melanie
A site for Mel.

## Building the site
From the root `/melanie`, run this command. It renders templates, compile CSS and JS. Outputs everything to `/site`.
```bash
npm run build
```

## Publishing
For some reason I set this up to track basically a separate project on the
`gh-pages` branch. So `/site` is actually the `gh-pages` branch, while the rest
is tracked on `master`.

1. So clone `gh-pages` to `/site`, and make sure you're checked out on `gh-pages`
2. You should be on `master` in the project root, and `gh-pages` in `/site
3. Build from master using `npm run build`
4. Back in `/site` you should have unstaged updates
5. Commit and push to `gh-pages`
