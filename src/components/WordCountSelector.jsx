export default function WordCountSelector({ maxWords, wordCount, setWordCount }) {
  const handleChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > maxWords) val = maxWords;
    setWordCount(val);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <label htmlFor="wordCount" className="text-lg font-semibold text-gray-700">
        How many words to play? (1 - {maxWords})
      </label>
      <input
        type="number"
        id="wordCount"
        min="1"
        max={maxWords}
        value={wordCount}
        onChange={handleChange}
        className="w-24 text-center text-2xl font-bold p-3 border-4 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-inner"
      />
    </div>
  );
}
