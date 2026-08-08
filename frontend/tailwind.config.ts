import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--accent)',
          fg: 'var(--accent-fg)',
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
        },
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        border: 'var(--border)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        sidebar: 'var(--sidebar)',
        'sidebar-ink': 'var(--sidebar-ink)',
        'sidebar-active': 'var(--sidebar-active)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
export default config;
