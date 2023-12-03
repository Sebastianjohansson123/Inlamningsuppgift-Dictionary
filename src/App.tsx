import { useEffect, useState } from 'react';
import './App.css';
import WordComponent from './WordComponent';

function App() {
  // This state is just a boolean value that controlls wether the app is in dark mode or not.
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode')
      ? JSON.parse(localStorage.getItem('darkMode')!)
      : false
  );

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: darkMode ? 'black' : 'white',
      }}
    >
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Light / dark mode
      </button>
      <WordComponent darkMode={darkMode} />
    </div>
  );
}

export default App;
