# Tasks on the phone

`index.html` is a single-file web app that reads a Markdown task list from Dropbox and shows it the way a phone wants it. It is meant to be served privately, from a machine you control (a local server on the Mac, reached from the phone over the home network or a VPN such as Tailscale). Nothing here is published anywhere, and the task file only ever travels between Dropbox and the browser that is logged in.

- **Swipe between sections.** Each `## Heading` in the file is a page. Swipe or tap the tab.
- **Filter by tag.** Chips for every `[Tag]` that appears at the start of items, most used first. Tap more than one to combine. Colors are assigned on first sight and stay stable.
- **Check things off.** Tapping a checkbox writes back to the file. A completed top-level item is struck through and moved to the top of Done. Un-checking something in Done moves it back to the top of Today. Subtask checkboxes flip in place. Every change has a five-second Undo.
- **Add with the floating button.** Title, tag, section and an optional note. It lands at the top of the chosen section as `- [ ] **[Tag] Title** - note`.
- **Reads offline.** The last copy is cached on the phone and refreshed whenever the app comes to the foreground.

The file is never reformatted. Edits change only the lines they touch, and saves use Dropbox's revision check so a change made elsewhere is never overwritten silently.

## Setup

### 1. Dropbox app (once)

At [dropbox.com/developers/apps](https://www.dropbox.com/developers/apps) create an app:

- Scoped access, **Full Dropbox** if the file lives at the root, otherwise App folder.
- Permissions tab: enable `files.content.read` and `files.content.write`, then submit.
- Settings tab, **Redirect URIs**: add the exact URL where this page is served on the Mac, for example `http://localhost:3000/app/`. Dropbox accepts plain `http` only for `localhost`; any other host has to be `https`.
- Copy the **App key**. No secret is needed; the page uses OAuth with PKCE from the browser.

### 2. Serve the folder

Put this folder next to whatever already serves the desk, or run any static server in it. The redirect URI you registered has to match the URL the page opens at, including the trailing slash. The gear sheet prints the exact value to register.

### 3. Connect on the Mac, pair the phone

1. Open the page on the Mac at the localhost URL, tap the gear, paste the app key, tap **Connect Dropbox**.
2. Once connected, the gear sheet shows a **pairing code**. Tap **Copy code**.
3. On the phone, open the same page at the Mac's address on the network (for example `http://mac-name.local:3000/app/`), tap the gear, paste the code into **Use pairing code**. Universal Clipboard makes the paste a one-step affair. **Copy link** gives a URL that pairs on open, if you prefer AirDropping it.
4. **Add to Home Screen** from the Safari share sheet. It opens full screen like an app.

If the phone reaches the Mac over `https` (Tailscale can issue a certificate with `tailscale serve`), the phone can also log in to Dropbox directly with the same app key, no pairing needed. Register that `https` URL as a second redirect URI.

The pairing code carries the Dropbox refresh token for your account, so treat it like a password: paste it, don't post it. **Sign out** on any device clears that device's copy.

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

No build step. Serve this folder from any static server. The Dropbox calls need a real app key, or mock the two `content.dropboxapi.com` endpoints in a browser automation script.
