import { useEffect, useState } from 'react';
import './wordComponent.css';

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
    setSearchResults([]);
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
    <div className="container">
      <h1 className="title">Dictionary</h1>
      <div className="searchForm">
        <form onSubmit={handleSearch}>
          <input
            className="searchInput"
            value={searchString}
            onChange={handleChange}
            placeholder="Search for a word"
            type="text"
          />
          <button className="searchButton" type="submit">
            Search
          </button>
          {error !== '' && <p className="errorMessage">{error}</p>}
        </form>
      </div>
      <div className="resultsContainer">
        {searchResults.length > 0 &&
          searchResults.map((result, index) => (
            <div key={index} className="result">
              <h2>Search result for: {result.word}</h2>
              {/* ... rest of your JSX */}

              {/* Phonetics */}
              <div className="box">
                <h4>Phonetics</h4>
                {result.phonetics.map(
                  (p, index) =>
                    p.text && (
                      <div
                        data-testid={'phoneticsDiv'}
                        style={{ display: 'flex' }}
                        key={index}
                      >
                        <img
                          style={{
                            objectFit: 'contain',
                            marginRight: '1rem',
                          }}
                          src="circle-1.png"
                          alt="circle"
                        />
                        <p>
                          {p.text} {index + 1 < result.phonetics.length && ','}
                        </p>
                      </div>
                    )
                )}
              </div>

              <div>
                <h4>
                  How to pronounce: <b>{result.word}</b>
                </h4>
                <div className="audio">
                  {result.phonetics.map(
                    (p, index) =>
                      p.audio !== '' && (
                        <div key={index}>
                          <audio
                            data-testid={`audio-${index}`}
                            aria-label={'test audio'}
                            style={{ display: 'flex' }}
                            controls
                          >
                            <source src={p.audio} type="audio/mpeg" />
                          </audio>
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Meanings */}
              {result.meanings.map((meaning, index) => (
                <div key={index}>
                  <h3>Part of Speech: {meaning.partOfSpeech}</h3>

                  <div className="box">
                    <h4>Definitions:</h4>
                    <div>
                      {meaning.definitions.map((def, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                          <img
                            style={{
                              objectFit: 'contain',
                              marginRight: '1rem',
                            }}
                            src="circle-1.png"
                            alt="circle"
                          />
                          <p>{def.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Synonyms */}
                  {meaning.synonyms.length > 0 && (
                    <div className="box">
                      <h4>Synonyms</h4>
                      {meaning.synonyms.map((synonym, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                          <img
                            style={{
                              objectFit: 'contain',
                              marginRight: '1rem',
                            }}
                            src="circle-1.png"
                            alt="circle"
                          />
                          <p data-testid="synonyms">{synonym}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Antonyms */}
                  {meaning.antonyms.length > 0 && (
                    <div className="box">
                      <h4>Antonyms</h4>
                      {meaning.antonyms.map((antonym, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                          <img
                            style={{
                              objectFit: 'contain',
                              marginRight: '1rem',
                            }}
                            src="circle-1.png"
                            alt="circle"
                          />
                          <p data-testid="antonyms">{antonym}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>
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
  interjections: string[];
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
