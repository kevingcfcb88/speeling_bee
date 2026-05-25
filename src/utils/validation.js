export function checkSpelling(inputString, targetWord) {
  if (!inputString || !targetWord) return false;
  return inputString.trim().toLowerCase() === targetWord.trim().toLowerCase();
}
