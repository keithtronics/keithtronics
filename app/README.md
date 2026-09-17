# Tasks on the phone

A swipeable, filterable view of a Markdown task list that lives in Dropbox, running entirely on an iPhone inside the free [Scriptable](https://scriptable.app) app. Nothing is hosted anywhere. The page is embedded in one script, Dropbox tokens live in the iOS keychain, and the task file only ever travels between Dropbox and the phone.

- **Swipe between sections.** Each `## Heading` in the file is a page. Swipe or tap the tab.
- **Filter by tag.** Chips for every `[Tag]` that appears at the start of items, most used first. Tap more than one to combine. Colors are assigned on first sight and stay stable.
- **Check things off.** Tapping a checkbox writes back to the file. A completed top-level item is struck through and moved to the top of Done. Un-checking something in Done moves it back to the top of Today. Subtask checkboxes flip in place. Every change has a five-second Undo.
- **Add with the floating button.** Title, tag, section and an optional note. It lands at the top of the chosen section as `- [ ] **[Tag] Title** - note`.
- **Reads offline.** The last copy is cached on the phone and refreshed on every open.
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
2. Open `Tasks.js` from this folder on the phone (AirDrop it, or open it from Dropbox or Files), select all, copy.
3. In Scriptable, tap **+**, paste, and name the script **Tasks**.

### 3. First run

Run the script. It asks for the app key, opens Dropbox so you can allow access, and Dropbox shows a code. Copy the code, come back, and paste it in the prompt (it is prefilled from the clipboard when it looks right). That's it. Later runs go straight to the page.

If the file is not at `/TASKS.md`, change the path in the gear sheet.

### 4. Make it feel like an app

- **Home Screen icon.** In the Shortcuts app, make a shortcut with the single Scriptable action **Run Script → Tasks**, then use the share button's **Add to Home Screen** and pick an icon.
- **Widget.** Add a Scriptable widget to the Home Screen, long-press it, choose **Tasks** as the script. Small shows three items, medium five, large ten.

`FULLSCREEN` at the top of the script controls whether the page fills the screen (default) or shows Scriptable's bar with a Done button.

**Sign out** in the gear sheet clears the keychain entry. The next run logs in again.

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

`index.html` is the page. `scriptable/Tasks.template.js` is the Scriptable host: login, keychain, the widget, and a small bridge that persists what the page stores. `node app/build.mjs` inlines the page into the template and writes `Tasks.js`, which is committed so it can be copied straight to the phone.

The page also runs in a normal browser for development. Serve this folder from any static server; the gear sheet then shows the same paste-a-code login. Tests mock the two `content.dropboxapi.com` endpoints and the token endpoint with Playwright, and run `Tasks.js` under a stubbed Scriptable runtime whose WebView is a real page.
