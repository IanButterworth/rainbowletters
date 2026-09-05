# Rainbow Letters 🦄

**Play it here: https://ianbutterworth.github.io/rainbowletters/**

A typing playground for small children. Every key press pops a big rainbow letter onto the screen with sparkles, a music-box note and a voice saying the letter. Space or Enter finishes the word: it wiggles, floats away, a unicorn flies past, and the word is spoken aloud. Real words the child might know (`CAT`, `DOG`, `RAINBOW`, `MUM`, `POOP`...) rain down their matching emoji.

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

The live site is published with GitHub Pages from the `main` branch, root folder, so pushing to `main` updates it within a minute. GitHub Pages tells browsers to cache files for 10 minutes, so when `style.css`, `languages.js` or `app.js` change, bump the `?v=` number on their tags in `index.html`; otherwise a visitor can get the new page with the old scripts until the cache expires.

## What is on screen

- Type letters or numbers: they appear in a big rainbow row (up to 20; after that the oldest one floats off).
- Space or Enter: celebrates the word. Finished words collect as little bubbles along the bottom.
- Backspace: pops the last letter.
- Any other key, click or tap: sparkles.
- Key mashing is throttled: bursts of 8 keys go through, then about 8 per second, and holding a key down does not repeat. The voice speaks the current letter and the latest one waiting, never a backlog.
- Moving the mouse leaves a rainbow trail.
- Top-right buttons: 🎵 toggles the background music (remembered between visits), ⛶ goes full screen.

## Languages

English, Spanish, Swedish, French, German, Portuguese and Italian. Pick one on the start screen or with the language button in the top-right corner; the choice is remembered. Each language has its own letter pictures (in Spanish, G pops a gato), its own words for the emoji showers, its own on-screen text, and a matching speech voice. Words match without accents, so typing MAMA finds MAMÁ and the accented spelling is what gets spoken. Everything per language lives in `languages.js`, so adding one is a matter of copying a block.

Sounds are synthesised in the browser with Web Audio, and the letters and words are spoken with the browser's built-in speech voices, so nothing is downloaded and it works offline once loaded.

## Keeping her on the page

The page does what a web page can to avoid accidental exits:

- No links, forms or scrolling. Right-click, text selection, drag, pinch zoom and pull-to-refresh are disabled.
- Keyboard shortcuts the browser lets a page intercept (find, print, save, reload, zoom, address bar) are swallowed. Tab and Space cannot move focus to the buttons.
- The back button and back swipe are neutralised.
- Closing the tab, reloading or navigating away asks for confirmation once she has started playing.

A browser cannot block Cmd+W, Cmd+T, Cmd+Q or the Mac's Fn/Globe key, so for a fully locked-down session:

- Use the ⛶ button. In Chrome this also locks the keyboard so Escape no longer leaves full screen; hold Escape for a couple of seconds to get out.
- Or launch Chrome in kiosk mode, which hides all browser chrome:

  ```sh
  open -na "Google Chrome" --args --kiosk --new-window "http://localhost:8000"
  ```

- In Chrome, keep "Warn Before Quitting (⌘Q)" enabled in the Chrome menu.
- On an iPad, use Guided Access (Settings → Accessibility) to pin the browser.

## Files

- `index.html`: page structure.
- `style.css`: the sky, clouds, rainbow, letter styling and animations.
- `app.js`: input handling, guards, canvas particles, Web Audio synth and music loop, speech.
