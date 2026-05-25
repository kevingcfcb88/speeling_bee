# 🐝 Spelling Bee

A fun, interactive, and bilingual (English + Spanish) spelling practice application designed for kids. Built with React, Vite, and Tailwind CSS.

## Features

- **Bilingual Practice**: Listen to the word in English, spell it using drag-and-drop letter tiles, and then challenge yourself to spell the Spanish translation from memory!
- **Audio Playback**: Uses the native Web Speech API to clearly pronounce the English words. Includes adjustable playback speeds (from 1x down to 0.5x) for careful listening.
- **Drag-and-Drop Interface**: A tactile, mobile-friendly interface built with `@dnd-kit` that avoids the frustration of on-screen keyboards for younger learners.
- **Custom Word Lists**: Easily add your own vocabulary lists by updating the simple `public/words.csv` file.
- **Dynamic Scoring & Time Bonuses**: Earn points based on accuracy (fewer attempts = more points) and speed (bonus points for answering under 15s or 30s).
- **Leaderboard**: Compete for the top spot! The top 5 scores are saved automatically in your browser's local storage.

## How to Play

1. Choose how many words you want to practice.
2. Click **Start Game**.
3. Listen to the English pronunciation. 
4. Drag and drop the correct letters into the "Spell in English" zone.
5. If correct, the "Spell in Spanish" zone will unlock. Spell the Spanish translation (without audio hints!).
6. View your score and save your name to the leaderboard at the end.

## Game Rules

### Spelling Rules
- **Case-Insensitive:** You can spell words using uppercase or lowercase letters interchangeably.
- **Compound Words:** For words with spaces (e.g., "computer room" or "ice cream"), **ignore the space**. The game will automatically filter out spaces, so you only need to drag and drop the actual letters!

### Scoring System
Each word is scored based on the number of attempts and how quickly you complete it:

**Accuracy Points:**
- **10 points** if spelled correctly on the 1st try.
- **7 points** if spelled correctly on the 2nd try.
- **5 points** if spelled correctly on the 3rd try (or more).

**Time Bonus:**
- **+2 bonus points** if completed in under 15 seconds.
- **+1 bonus point** if completed in under 30 seconds.

## Adding Custom Words

To add your own spelling words, simply edit the `public/words.csv` file in the project folder.

**Format rules:**
- Keep it simple: one word pair per line.
- Format: `english_word,spanish_word`
- Everything should be lowercase.

**Example (`public/words.csv`):**
```csv
apple,manzana
book,libro
cat,gato
dog,perro
house,casa
```

## Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Tech Stack

- **React 18**
- **Vite**
- **Tailwind CSS v4**
- **@dnd-kit** (Drag and Drop)
- **Lucide React** (Icons)
