export function calculateWordScore(attempts, timeInSeconds) {
  let attemptPoints = 0;
  
  if (attempts === 1) {
    attemptPoints = 10;
  } else if (attempts === 2) {
    attemptPoints = 7;
  } else if (attempts >= 3) {
    attemptPoints = 5;
  } else if (attempts === 0) {
    // Should theoretically not happen if they pass, but safety check
    attemptPoints = 10; 
  }

  let timeBonus = 0;
  if (timeInSeconds < 15) {
    timeBonus = 2;
  } else if (timeInSeconds < 30) {
    timeBonus = 1;
  }

  return attemptPoints + timeBonus;
}
