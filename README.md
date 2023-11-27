# React + TypeScript + Vite

## Kör följande commands i terminalen:

- npm init vite med TS.
- npm i React-testing-library
- npm i @testing-library/user-event
- npm i @testing-library/jest-dom
- npm i jsdom
- npm i vitest

## Skapa en setup.ts fil med detta innehåll:

import '@testing-library/jest-dom/vitest';

## vite config fil ska se ut såhär:

/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
plugins: [react()],
test: {
globals: true,
environment: 'jsdom',
setupFiles: 'setup.ts',
},
});

## Lägg till types i tsconfig filen:

under compilerOptions lägg till: <br/>
"types": ["vitest/globals"],

### vid testning av funktioner använd Jest
