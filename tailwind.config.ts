import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          canvas: 'var(--citt-bg-canvas)',
          section: 'var(--citt-bg-section)',
          surface: 'var(--citt-bg-surface)',
          subtle: 'var(--citt-bg-subtle)',
          elevated: 'var(--citt-bg-elevated)',
          inverse: 'var(--citt-bg-inverse)',
          'badge-bg': 'var(--citt-badge-bg)',
          'badge-text': 'var(--citt-badge-text)',
          'badge-border': 'var(--citt-badge-border)',
          primary: 'var(--citt-text-primary)',
          secondary: 'var(--citt-text-secondary)',
          'text-inverse': 'var(--citt-text-inverse)',
          border: 'var(--citt-border)',
          'border-strong': 'var(--citt-border-strong)',
        },
        duoc: {
          dark: '#1A1A1A',      // Paleta Primaria: Negro Duoc (.bg-dark)
          white: '#FFFFFF',     // Paleta Primaria: Blanco (.bg-white)
          yellow: '#FFB800',    // Paleta Primaria: Amarillo (.orange-duoc)
          grey: '#666666',      // Paleta Secundaria: Gris (.bg-grey)
          black: '#000000',     // Paleta Secundaria: Terciario
          neutral: '#EEEEEE',   // Paleta Secundaria: Neutro Duoc UC
        },
        citt: {
          blue: '#307FE2',      // Emblema Azul 3D CITT & Escuela Informática
          blueLight: '#8BB8E8',
          blueDeep: '#0A58CA',
        },
        escuelas: {
          informatica: { DEFAULT: '#307FE2', secondary: '#8BB8E8' },
          ingenieria: { DEFAULT: '#43B02A', secondary: '#A1D884' },
          diseno: { DEFAULT: '#C4D600', secondary: '#DBE442' },
          administracion: { DEFAULT: '#AC4FC6', secondary: '#C98BDB' },
          comunicacion: { DEFAULT: '#D50032', secondary: '#DF4661' },
          construccion: { DEFAULT: '#E87722', secondary: '#ECA154' },
          salud: { DEFAULT: '#5BC2E7', secondary: '#99D6EA' },
          gastronomia: { DEFAULT: '#FF585D', secondary: '#FF808B' },
          turismo: { DEFAULT: '#00A499', secondary: '#2AD2C9' },
        },
      },
      boxShadow: {
        'theme-card': 'var(--citt-shadow-card)',
      },
      fontFamily: {
        sans: ['var(--font-lato)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
      fontSize: {
        'duoc-h1': ['2.6875rem', { lineHeight: '1.15', fontWeight: '700' }],
        'duoc-h2': ['2.1rem', { lineHeight: '1.2', fontWeight: '700' }],
        'duoc-h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'duoc-h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '400' }],
        'duoc-h5': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'duoc-body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'duoc-small': ['0.8125rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;
