# melanie

## General notes
When coming back to the project, make sure you have the latest code in case someone edited a file from another machine.
```bash
git pull --rebase origin master
```

You might also need to install dependencies if something was updated.
```bash
npm i
```

## Updating the source code
After making changes to whatever files needed, create a commit with a message.
```bash
git add . && git commit -m "message"
```

Then, push the latest commit to Github.
```bash
git push origin master
```

## Building the site
From the root `/melanie`, run this command. It renders templates, compile CSS and JS. Outputs everything to `/site`.
```bash
npm run build
```

## Publishing
Then, move to the `/site` directory where the compiled files live.
```bash
cd site/
```

From inside `/site`, ensure you're on the `gh-pages` branch.
```bash
git branch

# should show a * next to gh-pages
```

Create a new commit.
```bash
# this message can be whatever, even just a .
git add . && git commit -m "message"
```

Push the branch to the remote git server where it is hosted.
```bash
git push origin gh-pages
```

## Previewing the dev site
From the `/site` directory, run this command.
```bash
live-server
```

That's it!
