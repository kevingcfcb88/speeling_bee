const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getDistractorLetters(word, count = 4) {
  const distractors = [];
  while (distractors.length < count) {
    const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    // Add logic if we want to avoid letters already in the word, 
    // but having duplicates of existing letters as distractors can also be tricky/good.
    distractors.push(randomLetter);
  }
  return distractors;
}

export function getShuffledLettersForWord(word, distractorCount = 4) {
  // Strip out spaces so we don't generate empty tiles for compound words
  const cleanWord = word.replace(/\s+/g, '');
  const wordLetters = cleanWord.split('');
  const distractors = getDistractorLetters(cleanWord, distractorCount);
  
  // Assign an ID to each letter tile to make it unique for drag-and-drop
  const allTiles = [...wordLetters, ...distractors].map((char, index) => ({
    id: `tile-${index}-${char}`,
    char
  }));
  
  return shuffle(allTiles);
}
