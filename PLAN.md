# Spelling Bee App for Kids (8-10 years) — Comprehensive Plan

## TL;DR

Build a React-based spelling bee practice app with bilingual support (English + Spanish). Kids listen to English word audio (adjustable speed 1x-0.5x), spell in English, then spell the same word in Spanish _without audio_ (from memory/translation). Score based on attempts (10/7/5 points) + time bonus (under 15s = +2, under 30s = +1). Drag-and-drop letter interface. Responsive design for mobile/tablet/desktop. Leaderboard stored in localStorage. Deploy to Vercel.

---

## Implementation Phases

### Phase 1: Project Setup & Data Structure

1. Create React app with Vite (faster dev experience, optimized builds)
2. Define JSON data structure for words with translations
   - Structure: `{ id, english, spanish }`
3. Create starter word list (30-50 words for MVP) in `public/words.csv` (fallback also hardcoded)
4. Set up project folder structure:
   - `src/components/` — UI components
   - `src/data/` — word lists & constants
   - `src/hooks/` — custom React hooks for audio, game logic
   - `src/pages/` — main pages (Setup, Game, Results)
   - `src/utils/` — helpers for audio playback, CSV parsing, validation

### Phase 2: Audio System (English only)

1. Create `useAudioControl()` custom hook using Web Speech API
   - **IMPORTANT**: Only pronounces **English** words, NOT Spanish
   - Implement playback speed control (1x → 0.9x → 0.8x → 0.7x → 0.6x → 0.5x)
   - When the user clicks the 'Play' icon, the speed decreases automatically to a minimum 0.5x
   - Track replay count and current speed
   - Add fallback for browsers without Speech API
2. UI for replay button with speed indicator (shows current playback rate)
3. Handle edge cases: speech synthesis not available, English language not supported

### Phase 3: Word Selection & Game Setup Screen

1. Create `WordCountSelector` component
   - Input field with min=1, max=(total words in list)
   - Only allow numbers ≤ available words
   - Auto-populate max from word list length
2. Create `GameSetupPage` component
   - Display total available words
   - Word count selector
   - "Start Game" button

### Phase 4: Letter Tile System (Core UX for kids)

1. Design letter tiles for drag-and-drop:
   - Correct letters from word
   - 3-5 extra "distractor" letters (random, similar difficulty)
   - Tiles arranged in randomized order
2. Create `LetterTile` component (draggable)
3. Create `DropZone` component (accepts tiles)
4. Implement drag-and-drop logic:
   - Use native HTML5 drag-and-drop or React DnD library (recommend react-beautiful-dnd for smooth mobile experience)
   - Prevent dropping same tile twice
   - Visual feedback: highlight valid zones, show placement zones

### Phase 5: Game Flow

1. Create game state management (useState or simple context):
   - Current word index
   - User's letter placements (English answer, Spanish answer)
   - Score tracking
   - Time tracking by word and total
   - Words completed list
2. Create `SpellingPage` component:
   - **Layout**:
     - Top: Speaker icon + replay button with speed indicator (for English only)
     - Middle: "Spell in English" section with drop zone
     - Lower: "Spell in Spanish" section with drop zone (**NO speaker icon—silent**)
     - Bottom: Letter tiles (shuffled)
   - **Flow**:
     - Play English word audio → kid spells English → confirm automatically
     - If English correct: Spanish section enables, no audio plays, kid spells from memory
     - If Spanish correct: move to next word automatically
3. Input validation:
   - Check if spelled word matches automatically (case-insensitive: "hello", "HELLO", "Hello" all accepted)
   - When English is correct, Spanish enables automatically (initially disabled)
   - Auto-advance on correct spelling or show an X or 'wrong' icon when incorrect
   - Track attempts for scoring
   - No hints

### Phase 6: Score Tracking & Results Screen

1. Create scoring system:
   - **Attempt-based points**:
     - Correct on first try: 10 points
     - Correct on 2nd try: 7 points
     - Correct on 3rd+ try: 5 points
   - **Time bonus** (per word):
     - Under 15 seconds: +2 bonus points
     - Under 30 seconds: +1 bonus point
     - 30+ seconds: +0 bonus points
   - Final score = (sum of word points × 2 rounds) + (time bonuses)
2. Create `ResultsPage` component:
   - Total score
   - Words correct/completed
   - Performance summary (avg time per word, attempts per word)
   - "Play Again" button (resets to setup screen)
3. Store leaderboard in localStorage:
   - Track top 5 max scores persisted across sessions
   - Display after game ends
   - Format: `{ name: "User", score: 150, date: "2026-05-24", wpm: 8 }`

### Phase 7: CSV File Loading

1. Attempt to load `words.csv` from the `public/` folder at app startup
   - If file exists and is valid: use it
   - If file NOT found or invalid: show error message ("Words file not found. Please add words.csv to public/ folder")
2. Parse CSV format: `English,Spanish` (one word pair per line, lowercase)
   - Example:
     ```
     apple,manzana
     book,libro
     cat,gato
     ```
3. Validation (do it when app starts):
   - Ensure both fields for each word
   - Handle encoding issues (UTF-8)
   - Error messaging if format is invalid
   - Skip empty lines

### Phase 8: Responsive Design

1. Mobile-first design using Tailwind CSS or styled-components
2. Breakpoints:
   - Mobile: < 640px (single column, larger touch targets)
   - Tablet: 640px - 1024px
   - Desktop: > 1024px
3. Touch-optimized:
   - Larger tap targets (min 44px)
   - Optimized drag-and-drop for touch (test on physical devices)
   - Portrait & landscape support

### Phase 9: Testing & Refinement

1. Manual testing:
   - Functionally: word flow, English audio only, Spanish silent, scoring, CSV loading
   - Device testing: iOS/Android phone, tablet, desktop browser
   - Audio: Speech API English pronunciation quality
   - Drag-and-drop: smooth on touch devices
2. Accessibility testing:
   - Keyboard navigation (for desktop)
   - Audio captions/visual feedback for hearing-impaired
   - High contrast mode compatibility
3. Performance:
   - Bundle size optimization
   - Audio speech synthesis loading time
4. Unit testing:
   - Make sure to create and edit the unit tests for components when needed

### Phase 10: Deployment

1. Build for production: `npm run build`
2. Ensure `words.csv` is included in `public/` folder before deployment

---

## Detailed File Structure

```
speeling_bee/
├── src/
│   ├── components/
│   │   ├── WordCountSelector.jsx
│   │   ├── LetterTile.jsx
│   │   ├── DropZone.jsx
│   │   ├── AudioPlayButton.jsx
│   │   ├── ResultsLeaderboard.jsx
│   │   └── FileUploadZone.jsx
│   ├── pages/
│   │   ├── GameSetup.jsx
│   │   ├── SpellingGame.jsx
│   │   └── ResultsPage.jsx
│   ├── hooks/
│   │   ├── useAudioControl.js
│   │   ├── useGameState.js
│   │   └── useDragDrop.js
│   ├── data/
│   │   └── starterWords.json (fallback words if CSV fails)
│   ├── utils/
│   │   ├── csvParser.js
│   │   ├── letters.js (shuffle, distractor letters)
│   │   ├── scoring.js
│   │   └── validation.js
│   ├── App.jsx
│   ├── App.css
│   └── index.jsx
├── public/
│   ├── index.html
│   └── words.csv (required: list of English,Spanish word pairs)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Key Technical Decisions

1. **Web Speech API (English only)**: Free, native browser support. Spanish is intentionally silent to focus on memory/translation skills. Trade-off: less reliable than cloud APIs, but fine for MVP and no costs.

2. **CSV format for words**: Simple, user-friendly format stored in public/ folder. Easier to maintain and share than JSON. Required file at app startup.

3. **Drag-and-drop with letter tiles**: Better UX for 8-10 year-olds than on-screen keyboard:
   - Visual/tactile feedback
   - Works across devices (mobile touch, desktop click)
   - Prevents typos
   - More engaging/game-like

4. **Letter distractor count**: 3-5 extra letters (not too overwhelming, still challenging).

5. **localStorage persistence**: Leaderboard saved across browser sessions. Simple, no backend needed.

6. **Case-insensitive spelling**: Kids can type any case; validation accepts all variants (improves UX, reduces frustration).

7. **Vite over Create React App**: Faster dev experience, smaller production bundle, better for static hosting.

---

## Verification Checklist

1. **Functional**:
   - [ ] Word count selector prevents selection > available words
   - [ ] Audio plays ONLY English word (NOT Spanish)
   - [ ] Playback speed cycles 1x → 0.9x → 0.8x... → 0.5x → back to 1x
   - [ ] Spanish section is silent (no audio button/playback)
   - [ ] Letter tiles display correct letters + 3-5 distractors (randomized)
   - [ ] Drag-and-drop works: drop zone accepts/rejects tiles correctly
   - [ ] Spelling validation (case-insensitive): accepts "hello", "HELLO", "Hello" for "hello"
   - [ ] Score calculation: 10/7/5 points + time bonuses (< 15s = +2, < 30s = +1)
   - [ ] CSV loads from public/words.csv; error shown if missing
   - [ ] Results screen shows correct score + leaderboard

2. **Responsive**:
   - [ ] Mobile (iPhone/Android): readable text, large touch targets, works in portrait & landscape
   - [ ] Tablet (iPad): optimal layout, no overflow
   - [ ] Desktop: proportional scaling, full page usage

3. **Audio**:
   - [ ] Web Speech API pronunciation clear for English words
   - [ ] No Spanish playback (Spanish section is silent)
   - [ ] Fallback graceful if Speech API unavailable

4. **User Experience**:
   - [ ] Game flow is intuitive for 8-10 year-olds (no confusing navigation)
   - [ ] Visual feedback for correct/incorrect answers
   - [ ] Drag-and-drop feels smooth on touch devices
   - [ ] Time tracking displays during game

5. **Deployment**:
   - [ ] Production build runs on Vercel
   - [ ] No console errors in deployment
   - [ ] Mobile viewing works on production URL
   - [ ] words.csv included in public/ folder

---

## Scope: Included vs. Excluded

**Included (MVP)**:

- Spelling practice in English & Spanish (English with audio, Spanish silent)
- Audio with 6 speed levels (1x to 0.5x) for English only
- Drag-and-drop letter interface
- Case-insensitive spelling validation
- Score tracking: attempts (10/7/5) + time bonus (< 15s = +2, < 30s = +1)
- Leaderboard (top 5 scores, localStorage persistence)
- Responsive layout (mobile/tablet/desktop)
- Starter word list (hardcoded fallback)
- CSV file loading from public/words.csv
- Web Speech API audio synthesis (English only)

**Excluded (Future features)**:

- Spanish audio pronunciation
- Persistent database (scores saved to account/backend)
- User accounts/authentication
- Difficulty levels or word categories
- Timed challenges
- Achievements/badges
- Offline mode / PWA
- Multiple languages beyond English/Spanish
- Teacher dashboard for monitoring student progress

---

## Further Considerations

1. **CSV File Management**:
   - Provide example words.csv with documentation
   - CSV format must be: `English,Spanish` (lowercase, one per line)
   - Error shown to user if file is missing/invalid at startup

2. **Letter Tile Complexity**:
   - Recommend max word length 8-10 letters for MVP
   - Long words + many tiles get crowded on mobile
   - Can expand in future iterations

3. **Time Bonus Calibration**:
   - 15s/30s thresholds may need adjustment based on user testing
   - Track timing data during beta to validate difficulty

4. **Speech API Fallback**:
   - Test on target devices early (especially Safari iOS)
   - If English audio issues arise, have visual pronunciation guide as backup

---

## Ready for Implementation?

This plan is ready for review and refinement. Once approved, we can proceed with Phase 1 (project setup) and build incrementally through all phases.
