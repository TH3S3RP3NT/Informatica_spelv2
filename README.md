# Platform Pulse

Platform Pulse is a fast-paced, side-scrolling platformer built with p5.js. Run across shifting platforms, dodge spikes, grab coins, and chase ever-rising score targets while upbeat music keeps you moving.

## Gameplay loop
- Launch to the menu and pick Start Game, How to Play, Settings, Credits, or Leaderboard.
- Enter a username before your first run so scores can be saved.
- Auto-scroll across ground and floating platforms, collecting coins (+10) and avoiding spikes that drain health.
- Hit the target score shown in the HUD to win; each win increases the next target by +100. Losing all health triggers Game Over.
- After a run press `R` to restart quickly or `L` to jump to the leaderboard.

## Controls
- Move: Arrow Keys or `A/D`
- Jump: `Space`, `Up`, or `W`
- Duck: `Down` or `S`
- Menus: Mouse to click buttons

## Audio and settings
- Background playlist plays via p5.sound; it auto-advances when a track ends.
- Toggle music and sound effects in Settings. Choices are stored so they persist between sessions.


## Project map
- `index.html` wires p5.js, scenes, and assets.
- `src/main.js` boots the SceneManager and music controller.
- `src/home.js` menu; `src/game.js` name entry; `src/dash.js` core runner gameplay.
- `src/instructions.js`, `src/settings.js`, `src/credits.js`, `src/leaderboard.js` handle supporting screens.
- `public/assets/` holds sprites, fonts, audio, and JSON track list.


