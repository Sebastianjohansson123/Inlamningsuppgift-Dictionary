import { useEffect, useState } from 'react';
import './App.css';
import WordComponent from './WordComponent';

function App() {
  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<[]>([]);
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

      <WordComponent searchResults={searchResults} />
    </>
  );
}

export default App;
