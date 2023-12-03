import { http } from 'msw';
import MockData from './mockResponse.json';

export const handlers = [
  // add a response for https://api.dictionaryapi.dev/api/v2/entries/en/hello

  http.get('https://api.dictionaryapi.dev/api/v2/entries/en/hello', () => {
    return new Response(JSON.stringify(MockData));
  }),
];
