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
