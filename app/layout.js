import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Yutira 2026',
    template: '%s | Yutira 2026'
  },
  description: 'National level technical symposium by Department of Civil Engineering, PSG College of Technology.',
  icons: { icon: '/yutira-logo.jpeg' },
  openGraph: {
    title: 'Yutira 2026 — Bridging Ideas, Building Realities',
    description: 'National level technical symposium by the Department of Civil Engineering, PSG College of Technology. March 27 & 28, 2026.',
    images: ['/yutira-logo.jpeg']
  }
};

export const viewport = {
  themeColor: '#0b0f19',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main id="main" className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
