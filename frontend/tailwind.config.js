/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#171d23',
        inset: '#12181d',
        panel: '#20282f',
        raised: '#2a343c',
        line: '#3b474f',
        ink: '#e5e9e9',
        muted: '#a7b2b7',
        accent: { DEFAULT: '#86bbaf', hover: '#a3cfc3' },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
