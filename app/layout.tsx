import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import { Navbar } from '../apps/web/screens/Navbar';
import { Footer } from '../apps/web/screens/Footer';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'LaunchKit AI - Transform Content into Sellable Micro-Courses',
    template: '%s | LaunchKit AI',
  },
  description:
    'Turn your long-form content into profitable micro-courses in minutes. Import content, generate courses with AI, and start earning.',
  keywords: [
    'AI course creation',
    'micro-courses',
    'content monetization',
    'online learning',
    'AI education',
  ],
  authors: [{ name: 'LaunchKit AI' }],
  creator: 'LaunchKit AI',
  publisher: 'LaunchKit AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://launchkit.ai'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://launchkit.ai',
    title: 'LaunchKit AI - Transform Content into Sellable Micro-Courses',
    description:
      'Turn your long-form content into profitable micro-courses in minutes. Import content, generate courses with AI, and start earning.',
    siteName: 'LaunchKit AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LaunchKit AI - AI-Powered Course Creation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaunchKit AI - Transform Content into Sellable Micro-Courses',
    description:
      'Turn your long-form content into profitable micro-courses in minutes. Import content, generate courses with AI, and start earning.',
    images: ['/og-image.png'],
    creator: '@launchkitai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-token',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
