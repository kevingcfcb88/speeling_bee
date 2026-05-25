import starterWords from '../data/starterWords.json';

export async function loadWords() {
  try {
    const response = await fetch('/words.csv');
    if (!response.ok) {
      throw new Error('words.csv not found');
    }
    const text = await response.text();
    const parsedWords = parseCSV(text);
    
    if (parsedWords.length === 0) {
      throw new Error('words.csv is empty or invalid');
    }
    return { words: parsedWords, error: null };
  } catch (err) {
    console.warn('Failed to load or parse words.csv, falling back to starter words:', err);
    return { words: starterWords, error: 'Words file not found or invalid. Using starter words.' };
  }
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const words = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return; // skip empty lines
    const parts = line.split(',');
    if (parts.length >= 2) {
      words.push({
        id: `csv-${index}`,
        english: parts[0].trim().toLowerCase(),
        spanish: parts[1].trim().toLowerCase()
      });
    }
  });
  
  return words;
}
