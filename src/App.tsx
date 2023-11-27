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

  const handleSearch = async () => {
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
        <input
          onChange={handleChange}
          placeholder="Search for a word"
          type="text"
        />
        <button onClick={() => handleSearch()}>Search</button>
        {error !== '' ? <p style={{ color: 'red' }}>{error}</p> : <></>}
      </div>

      <WordComponent searchResults={searchResults} />
    </>
  );
}

export default App;
