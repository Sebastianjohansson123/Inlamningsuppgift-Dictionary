interface Phonetic {
  audio: string;
  text: string;
  sourceUrl?: string;
}

interface Definition {
  partOfSpeech: string;
  definitions: Array<{ definition: string }>;
  synonyms: string[];
  antonyms: string[];
}

interface SearchResult {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Definition[];
  sourceUrls: string[];
}

interface Props {
  searchResults: SearchResult[];
}

const WordComponent = ({ searchResults }: Props) => {
  return (
    <div>
      {searchResults.map((result, index) => (
        <div key={index}>
          <h2>{result.word}</h2>

          {/* Filter phonetics and use the first one with non-empty audio */}
          {(() => {
            const phoneticsWithAudio = result.phonetics.filter(
              (p) => p.audio !== ''
            );
            if (phoneticsWithAudio.length > 0) {
              const p = phoneticsWithAudio[0]; // First phonetic with audio
              return (
                <div key={p.text}>
                  <p>Phonetic: {p.text}</p>
                  <audio controls>
                    <source src={p.audio} type="audio/mpeg" />
                  </audio>
                </div>
              );
            }
          })()}

          {result.meanings.map((meaning, meaningIndex) => (
            <div key={meaningIndex}>
              <h3>{meaning.partOfSpeech}</h3>
              {meaning.definitions.map((def, defIndex) => (
                <p key={defIndex}>{def.definition}</p>
              ))}
              {/* Synonyms, Antonyms, etc. */}
            </div>
          ))}
          {/* Map other properties as needed */}
        </div>
      ))}
    </div>
  );
};

export default WordComponent;
