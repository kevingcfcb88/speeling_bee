export function checkSpelling(inputString, targetWord) {
  if (!inputString || !targetWord) return false;
  // Ignore spaces and case for validation
  const cleanInput = inputString.replace(/\s+/g, '').toLowerCase();
  const cleanTarget = targetWord.replace(/\s+/g, '').toLowerCase();
  return cleanInput === cleanTarget;
}
