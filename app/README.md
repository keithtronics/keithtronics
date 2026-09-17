# Bureau

A swipeable, filterable view of a Markdown task list that lives in Dropbox, running entirely on an iPhone inside the free [Scriptable](https://scriptable.app) app. Nothing is hosted anywhere. The page is embedded in one script, Dropbox tokens live in the iOS keychain, and the task file only ever travels between Dropbox and the phone.

- **Swipe between sections.** Each `## Heading` in the file is a page. Swipe or tap the tab.
- **Filter by tag.** A chip for every `[Tag]` that appears at the start of items, labeled with its first four letters, most used first. Tap to filter, tap again to clear, tap several to combine. Colors are assigned on first sight and stay stable.
- **Check things off.** Tapping a checkbox writes back to the file. A completed top-level item slides away, is struck through, and lands at the top of Done. Every change has a six-second Undo. Un-checking something in Done puts it back where it came from (the app remembers), or asks which section if it doesn't know. Subtask checkboxes flip in place.
- **Add with the floating button.** Title, tag, section and an optional note. It lands at the top of the chosen section as `- [ ] **[Tag] Title** - note`.
- **Works offline.** The last copy is cached on the phone and refreshed on every open. Pull down to refresh, or tap the status text. Edits made without signal queue up (the status says "Offline · 2 pending") and land when the connection is back. Each edit is stored as an operation that finds its item by content, so if the file changed elsewhere in the meantime the edits are replayed onto the new copy instead of being dropped; an edit whose item no longer exists is skipped with a note.
- **Swipe a sheet down** to dismiss it.
- **Settings are hidden.** Tap the word Bureau to open them (file path, sign out).
- **Home Screen widget.** The same script, added as a Scriptable widget, shows the open items of the first section. Tapping it opens the app.

The file is never reformatted. Edits change only the lines they touch, and saves use Dropbox's revision check so a change made elsewhere is never overwritten silently.

## Setup

### 1. Dropbox app key (once, two minutes)

At [dropbox.com/developers/apps](https://www.dropbox.com/developers/apps) create an app:

- Scoped access. **Full Dropbox** if the file lives at the root of your Dropbox, otherwise App folder.
- Permissions tab: enable `files.content.read` and `files.content.write`, then Submit.
- Settings tab: copy the **App key**. No secret and no redirect URI are needed; the login uses Dropbox's paste-a-code flow with PKCE.

### 2. Put the script in Scriptable

1. Install Scriptable from the App Store.
2. Open `Bureau.js` from this folder on the phone (AirDrop it, or open it from Dropbox or Files), select all, copy.
3. In Scriptable, tap **+**, paste, and name the script **Bureau**.

### 3. First run

Run the script. It asks for the app key, opens Dropbox so you can allow access, and Dropbox shows a code. Copy the code, come back, and paste it in the prompt (it is prefilled from the clipboard when it looks right). That's it. Later runs go straight to the page.

If the file is not at `/TASKS.md`, tap the word Bureau and change the path there.

### 4. Make it feel like an app

- **Home Screen icon.** In the Shortcuts app, make a shortcut with a single **Open URL** action set to `scriptable:///run/Bureau`, then use the share button's **Add to Home Screen** and pick an icon. (Scriptable's own **Run Script** action also works, but only with **Run In App** switched on; off, it runs inside Shortcuts where no page can be shown.)
- **Widget.** Add a Scriptable widget to the Home Screen, long-press it, choose **Bureau** as the script. Small shows three items, medium five, large ten.

`FULLSCREEN` at the top of the script controls whether the page fills the screen (default) or shows Scriptable's bar with a Done button.

**Sign out** (tap Bureau) clears the keychain entry. The next run logs in again.

## File format the parser expects

```markdown
## Today
- [ ] **[Tag] Title** - optional note
  - [ ] subtask
  - [x] done subtask

## Done
- [x] ~~[Tag] Title~~ - optional note
```

Anything that doesn't match is left alone and shown as plain text. Section names other than Today and Done are fine; only the move-on-complete behavior looks for those two.

## Development

`index.html` is the page. `scriptable/Bureau.template.js` is the Scriptable host: login, keychain, the widget, and a small bridge that persists what the page stores. `node app/build.mjs` inlines the page into the template and writes `Bureau.js`, which is committed so it can be copied straight to the phone.

The page also runs in a normal browser for development. Serve this folder from any static server; the gear sheet then shows the same paste-a-code login. Tests mock the two `content.dropboxapi.com` endpoints and the token endpoint with Playwright, and run `Bureau.js` under a stubbed Scriptable runtime whose WebView is a real page.
