import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { asset } from '@/lib/assets';

const display = localFont({ src: '../public/fonts/display.ttf', variable: '--font-display', display: 'swap' });
const body = localFont({ src: '../public/fonts/body.ttf', variable: '--font-body', display: 'swap' });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: 'PUBG: BATTLEGROUNDS — Every Drop. A New Story.',
  description: 'Drop into the definitive battle royale. Explore iconic battlegrounds, find your weapon, and be the last one standing.',
  openGraph: { title: 'PUBG: BATTLEGROUNDS', description: 'Survive. Adapt. Conquer.', images: [asset('/images/hero.webp')] },
};
export const viewport: Viewport = { themeColor: '#0b0b0b' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>;
}
