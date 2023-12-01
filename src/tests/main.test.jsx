import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import App from '../App';
import WordComponent from '../WordComponent';

describe('Test that elements are rendered before using the API', () => {

  test('H1 is rendered', () => {
    render(<WordComponent />);
      const h1 = screen.getByText('Dictionary');
      expect(h1).toBeInTheDocument();
    });
  
  test('Searchbar & Search button is rendered', () => {
  render(<WordComponent />);
    const searchbar = screen.getByPlaceholderText('Search for a word');
    expect(searchbar).toBeInTheDocument();
  
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Search');
  })

})

describe('Tests against the API', () => {
  
  test('make sure that the api provides an answer', async () => {
    render(<WordComponent />);
    const user = userEvent.setup();
    const searchBar = screen.getByPlaceholderText('Search for a word');
    await user.type(searchBar, 'hello');
  
    const button = screen.getByRole('button') && screen.getByText('Search');
    await user.click(button);
  
    const result = await waitFor(() => screen.getByText('hello'));
    expect(result).toBeInTheDocument();
  
    const phonetics = await waitFor(() => screen.getByText('Phonetics'));
    expect(phonetics).toBeInTheDocument();
  })
  
  test('make sure that all parts of the answer is rendered ', async () => {
  render(<WordComponent />);
  const user = userEvent.setup();
  const searchBar = screen.getByPlaceholderText('Search for a word');
  await user.type(searchBar, 'hello');
  
  const button = screen.getByRole('button') && screen.getByText('Search');
  await user.click(button);

  const wordSearchedFor = await waitFor(() => screen.getByText('Search result for: hello'));
  expect(wordSearchedFor).toBeInTheDocument();

  // phonetics div
  const phonenetics = await waitFor(() => screen.getAllByTestId('phoneticsDiv'));
  expect(phonenetics[0]).toBeInTheDocument();

  // phonetics header
  const phoneticsHeader = await waitFor(() => screen.getByText('Phonetics'));
  expect(phoneticsHeader).toBeInTheDocument();

  // phonetics text
  const phoneticsText = await waitFor(() => phonenetics[0].firstChild);
  expect(phoneticsText).toBeInTheDocument();

  // phonetics audio
  const phoneticsAudio = await waitFor(() => screen.getByTestId('audio-0'));
  expect(phoneticsAudio).toBeInTheDocument();

  const noun = await waitFor(() => screen.getByText('Part of Speech: noun'))
  expect(noun).toBeInTheDocument();

  const verb = await waitFor(() => screen.getByText('Part of Speech: verb'))
  expect(verb).toBeInTheDocument();

  const interjection = await waitFor(() => screen.getByText('Part of Speech: interjection'))
  expect(interjection).toBeInTheDocument();

  const nounDefinition = await waitFor(() => screen.getByText('"Hello!" or an equivalent greeting.'))
  expect(nounDefinition).toBeInTheDocument();

  const synonymsHeader = await waitFor(() => screen.getByText('Synonyms'))
  expect(synonymsHeader).toBeInTheDocument();

  const synonyms = await waitFor(() => screen.getByTestId('synonyms'))
  expect(synonyms).toBeInTheDocument();



})

test('make sure that the error message isnt rendered before its supposed', async () => {
  render(<WordComponent />);

  const error = await waitFor(() => screen.queryByText('No results found, please try another word! 🙂')) 
  expect(error).not.toBeInTheDocument();

  const user = userEvent.setup();
  const searchBar = screen.getByPlaceholderText('Search for a word');
  await user.type(searchBar, 'hello');

  const button = screen.getByRole('button') && screen.getByText('Search');
  await user.click(button);

  const errorAfterSearch = await waitFor(() => screen.queryByText('No results found, please try another word! 🙂'))
  expect(errorAfterSearch).not.toBeInTheDocument();
})

test('Make sure that the error message is shown when you search for a word that doesnt exist', async () => {
render(<WordComponent />);
const user = userEvent.setup(); 

const searchBar = screen.getByPlaceholderText('Search for a word');
await user.type(searchBar, 'öööö');

const button = screen.getByRole('button') && screen.getByText('Search');
await user.click(button);

const error = await waitFor(() => screen.getByText('No results found, please try another word! 🙂'))
expect(error).toBeInTheDocument();
})

test('Make sure that the error message is shown when you search for an empty string', async () => {
render(<WordComponent />);
const user = userEvent.setup(); 

const button = screen.getByRole('button') && screen.getByText('Search');
await user.click(button);

const error = await waitFor(() => screen.getByText('No results found, please try another word! 🙂'))
expect(error).toBeInTheDocument();
})

// Describe slutar här!
})

test('Make sure that the darkmode button works properly', async () => {
  render(<App />);
  const user = userEvent.setup();
  const darkModeButton = screen.getByRole('button' , {name: 'Toggle Light / dark mode'}) 
  expect(darkModeButton).toBeInTheDocument();

  const dictionaryElement = screen.getByText('Dictionary');
  expect(dictionaryElement).toHaveStyle('color: rgb(0, 0, 0)');

  await user.click(darkModeButton);
  expect(dictionaryElement).toHaveStyle('color: rgb(255, 255, 255)');
})

test('Make sure that the favourite words work properly', async () => {
render(<App />);
const user = userEvent.setup();
const searchBar = screen.getByPlaceholderText('Search for a word');
await user.type(searchBar, 'hello');

const searchButton = screen.getByRole('button' , {name: 'Search'})
await user.click(searchButton);


// const addToFavouritesButton = await waitFor(() => screen.getByText('Add to favorites') ) 
const addToFavouritesButton = await waitFor(() => screen.getByRole('button', {name: '❤️'}) ) 
expect(addToFavouritesButton).toBeInTheDocument();

await user.click(addToFavouritesButton);

const favouritesHeader = await waitFor(() => screen.getByText('🌸 Mina favoritare 🌸'))
expect(favouritesHeader).toBeInTheDocument();

const favoritesDiv = await waitFor(() => screen.getByTestId('favoritesDiv'))

expect(favoritesDiv).toBeInTheDocument();
expect(favoritesDiv).toHaveTextContent('hello')
})




// kolla om knapp & input finns ✅
// kolla om man ser header i det rätta ordet ✅
// kolla om man hittar phonetics header ✅
// kolla om man hittar phonetics div ✅
// kolla om man hittar phonetics div children ✅
// kolla om man hittar audio filer
// kolla om man hittar part of speech (alla 3) ✅
// kolla om man hittar synonyms header ✅
// kolla om man hittar synonymer ✅
// kolla om man ser ett error message ✅
// se till så att error message inte hittas varken innan man söker eller efter man har gjort en fungerande sökning ✅