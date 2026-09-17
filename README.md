# keithtronics

## Tasks: a phone view of `TASKS.md`

`docs/index.html` is a single-file web app that reads `TASKS.md` from Dropbox and shows it the way a phone wants it:

- **Swipe between sections.** Each `## Heading` in the file (Today, This Week, Later, Waiting On, Done) is a page. Swipe or tap the tab.
- **Filter by tag.** Chips for Humane, Philips, Arthrex and Personal, taken from the `[Tag]` at the start of each item. Tap more than one to combine. Any other tag that shows up in the file gets a chip too.
- **Check things off.** Tapping a checkbox writes back to the file. A completed top-level item is struck through and moved to the top of Done, matching how the file is kept by hand. Un-checking something in Done moves it back to the top of Today. Subtask checkboxes just flip in place. Every change has a five-second Undo.
- **Add with the floating button.** Title, tag, section and an optional note. It lands at the top of the chosen section as `- [ ] **[Tag] Title** - note`.
- **Works offline for reading.** The last copy is cached on the phone and refreshed whenever the app comes to the foreground.

The file is never reformatted. Edits change only the lines they touch, and saves use Dropbox's revision check so a change made elsewhere is never overwritten silently.

### Setup (once)

1. **Publish the page.** In the GitHub repo settings, enable Pages from the `main` branch, folder `/docs`. Note the URL, for example `https://<user>.github.io/keithtronics/`.
2. **Create a Dropbox app** at [dropbox.com/developers/apps](https://www.dropbox.com/developers/apps):
   - Scoped access, **Full Dropbox** (the file lives at the root).
   - Permissions tab: enable `files.content.read` and `files.content.write`, then submit.
   - Settings tab: add the Pages URL from step 1 to **Redirect URIs**. It has to match exactly, including the trailing slash.
   - Copy the **App key**. No secret is needed; the app uses OAuth with PKCE from the browser.
3. **Open the page on your iPhone**, tap the gear, paste the app key, confirm the path is `/TASKS.md`, and tap Connect Dropbox.
4. **Add to Home Screen** from the Safari share sheet. It opens full screen like an app.

The token lives only in that browser's local storage. Sign out from the gear sheet clears it.

### File format the parser expects

```markdown
## Today
- [ ] **[Arthrex] Title** - optional note
  - [ ] subtask
  - [x] done subtask

## Done
- [x] ~~[Personal] Title~~ - optional note
```

Anything that doesn't match is left alone and shown as plain text.

### Development

No build step. Open `docs/index.html` from any static server. The Dropbox calls need a real app key, or mock the two `content.dropboxapi.com` endpoints in a browser automation script.
