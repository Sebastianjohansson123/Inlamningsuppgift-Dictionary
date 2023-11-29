const WordComponent = ({ searchResults }: Props) => {
  return (
    <div>
      {searchResults.map((result, index) => (
        <div key={index}>
          <h2>Search result for: {result.word}</h2>

          {/* Phonetics */}
          <div style={{ background: 'lightblue' }}>
            <h3>Phonetics</h3>
            {result.phonetics.map((p, index) => (
              <div key={index}>
                <p>Text: {p.text}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'lightblue' }}>
            <h3>
              How to pronounce: <b>{result.word}</b>
            </h3>
            {result.phonetics.map((p, index) => (
              // Todo, ta bort dom som inte innehåller audio
              <div key={index}>
                <audio controls>
                  <source src={p.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>

          {/* Meanings */}
          {result.meanings.map((meaning, index) => (
            <div key={index}>
              <h3>Part of Speech: {meaning.partOfSpeech}</h3>

              <div style={{ background: 'lightblue' }}>
                <h3>Definitions:</h3>
                {meaning.definitions.map((def, index) => (
                  <p key={index}>{def.definition}</p>
                ))}
              </div>

              {/* Synonyms */}
              {meaning.synonyms.length > 0 && (
                <div style={{ background: 'lightblue' }}>
                  <h3>Synonyms</h3>
                  {meaning.synonyms.map((synonym, index) => (
                    <p key={index}>{synonym}</p>
                  ))}
                </div>
              )}

              {/* Antonyms */}
              {meaning.antonyms.length > 0 && (
                <div style={{ background: 'lightblue' }}>
                  <h3>Antonyms</h3>
                  {meaning.antonyms.map((antonym, antonymIndex) => (
                    <p key={antonymIndex}>{antonym}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordComponent;

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
