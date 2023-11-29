import { useEffect, useState } from 'react';

const WordComponent = () => {
  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('SearchResult:', searchResults);
  }, [searchResults]);

  useEffect(() => {
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello')
      .then((response) => response.json())
      .then((data) => console.log('initial fetch:', data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchString(e.target.value);
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${searchString}`
    );

    if (res.ok) {
      const data = await res.json();
      setSearchResults(data);
      setSearchString('');
      setError('');
    } else {
      setError('No results found, please try another word! 🙂');
      console.log('error with fetching');
    }
  };
  return (
    <>
      <h1>Dictionary</h1>
      <div>
        <form onSubmit={handleSearch}>
          <input
            value={searchString}
            onChange={handleChange}
            placeholder="Search for a word"
            type="text"
          />
          <button type="submit">Search</button>
          {error !== '' ? <p style={{ color: 'red' }}>{error}</p> : null}
        </form>
      </div>

      <div>
        {searchResults.length > 0 ? (
          <>
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
          </>
        ) : (
          <></>
        )}
      </div>
    </>
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
