import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, expect, test } from 'vitest';
import App from '../App';
import WordComponent from '../WordComponent';
import { server } from '../mocks.node';


// We run these 3 rows to make sure that the tests are run towards the msw (mock server)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())



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

  test('Make sure that submit works by pressing enter', async () => {
    render(<WordComponent />);
    const user = userEvent.setup();
    const searchBar = screen.getByPlaceholderText('Search for a word');
    await user.type(searchBar, 'hello', {delay: 1});
    await user.type(searchBar, '{enter}');
  
    const result = await screen.findByText('Search result for: hello');
    expect(result).toBeInTheDocument();
  })



  
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
  const phoneneticsDiv = await waitFor(() => screen.getByTestId('phoneticsDiv')); // flytta ut diven och testa bara en div
  expect(phoneneticsDiv).toBeInTheDocument();

  // phonetics text
  const phoneticsText = await waitFor(() => phoneneticsDiv.firstChild);
  expect(phoneticsText).toBeInTheDocument();


  const phoneticsHeader = await screen.findByText('Phonetics'); 
  expect(phoneticsHeader).toBeInTheDocument();

  const phoneticsAudio = await screen.findByTestId('audio-0');
  expect(phoneticsAudio).toBeInTheDocument();

  const noun = await screen.findByText('Part of Speech: noun')
  expect(noun).toBeInTheDocument();

  const verb = await screen.findByText('Part of Speech: verb')
  expect(verb).toBeInTheDocument();

  const interjection = await screen.findByText('Part of Speech: interjection')
  expect(interjection).toBeInTheDocument();

  const nounDefinition = await screen.findByText('"Hello!" or an equivalent greeting.')
  expect(nounDefinition).toBeInTheDocument();

  const synonymsHeader = await screen.findByText('Synonyms')
  expect(synonymsHeader).toBeInTheDocument();

  const synonyms = await screen.findByTestId('synonyms') 
  expect(synonyms).toBeInTheDocument();

})

test('make sure that the error message isnt rendered before its supposed to', async () => {
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
const searchBar = screen.getByPlaceholderText('Search for a word');
await user.clear(searchBar);

const button = screen.getByRole('button') && screen.getByText('Search');
await user.click(button);

const error = await waitFor(() => screen.getByText('No results found, please try another word! 🙂'))
expect(error).toBeInTheDocument();
})



  test('Make sure that the darkmode button works properly', async () => {
    window.localStorage.clear();
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
  
  const addToFavouritesButton = await waitFor(() => screen.getByRole('button', {name: '❤️'}) ) 
  expect(addToFavouritesButton).toBeInTheDocument();
  
  await user.click(addToFavouritesButton);
  
  const favouritesHeader = await waitFor(() => screen.getByText('🌸 Mina favoritare 🌸'))
  expect(favouritesHeader).toBeInTheDocument();

  const favouritesDiv = await waitFor(() => screen.getByTestId('favoritesDiv'))
  expect(favouritesDiv).toBeInTheDocument();

  const favoritesWord = await waitFor(() => within(favouritesDiv).queryByText('hello')) 
  expect(favoritesWord).toBeInTheDocument();
  
  })

test('Make sure that the favorites can be pressed to render a favorite word', async () => {
  render(<App />);
  const user = userEvent.setup();
  const searchBar = screen.getByPlaceholderText('Search for a word');
  await user.type(searchBar, 'hello');

  const searchButton = screen.getByRole('button' , {name: 'Search'})
  await user.click(searchButton);

  const addToFavouritesButton = await waitFor(() => screen.getByRole('button', {name: '❤️'}) )
  await user.click(addToFavouritesButton);

  await user.clear(searchBar);
  await user.type(searchBar, 'ööö');
  await user.click(searchButton);
  expect(await screen.findByText('No results found, please try another word! 🙂')).toBeInTheDocument();

  const favoritesDiv = await waitFor(() => screen.getByTestId('favoritesDiv'))
  expect(favoritesDiv).toBeInTheDocument();

  const favoritesDiv1 = await waitFor(() => screen.getByTestId('favoriteDiv0'))
  expect(favoritesDiv1).toBeInTheDocument();

  const favoritesWord = await waitFor(() => within(favoritesDiv1).queryByText('hello'))
  expect(favoritesWord).toBeInTheDocument();

  await user.click(favoritesWord);

  const searchResultHeader = await waitFor(() => screen.getByText('Search result for: hello'))
  expect(searchResultHeader).toBeInTheDocument();
})
