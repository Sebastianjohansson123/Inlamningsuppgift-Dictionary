import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
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

// Describe slutar här!
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
// kolla om man ser ett error message 
// se till så att error message inte hittas varken innan man söker eller efter man har gjort en fungerande sökning