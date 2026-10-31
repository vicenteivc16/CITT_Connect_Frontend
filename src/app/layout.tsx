import type { Metadata } from 'next';
import { Lato, Merriweather } from 'next/font/google';
import './globals.css';
import { CittNetworkProvider } from '@/context/CittNetworkContext';
import { Navbar } from '@/components/Navbar';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata: Metadata = {
  title:
    'CITT Connect — Red Nacional de Innovación & Transferencia Tecnológica Duoc UC',
  description:
    'Portal editorial, directorio nacional con vínculo +Connect y credencial QR dinámica para los Centros de Innovación y Transferencia Tecnológica (CITT) de Duoc UC.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/assets/citt-logo.webp',
    apple: '/assets/citt-logo.webp',
  },
};

export const viewport = {
  themeColor: '#FFB800',
};

const ANTI_FOUC_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('citt_connect_theme_v2');
    var theme = (saved === 'dark' || saved === 'light') ? saved : 'light';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.backgroundColor = theme === 'dark' ? '#000000' : '#FFFFFF';
    root.style.color = theme === 'dark' ? '#FFFFFF' : '#1A1A1A';
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-CL"
      data-theme="light"
      suppressHydrationWarning
      className={`${lato.variable} ${merriweather.variable} light`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen overflow-x-hidden bg-theme-canvas font-sans text-theme-primary antialiased selection:bg-[#FFB800] selection:text-[#1A1A1A]"
      >
        <CittNetworkProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </CittNetworkProvider>
      </body>
    </html>
  );
}
