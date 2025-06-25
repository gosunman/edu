import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "과학 학습실 - 중1,2,3학년 과학 교육",
  description: "중학교 과학 교육을 위한 인터랙티브 학습 플랫폼. 암기 카드와 3D 시뮬레이션으로 과학을 재미있게 배워보세요.",
  keywords: "과학, 교육, 중학교, 학습, 암기카드, 시뮬레이션, 물질의 구성, 전기와 자기, 화학 반응, 생태계",
  authors: [{ name: "과학 학습실" }],
  creator: "과학 학습실",
  publisher: "과학 학습실",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://science-learning.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "과학 학습실 - 중1,2,3학년 과학 교육",
    description: "중학교 과학 교육을 위한 인터랙티브 학습 플랫폼. 암기 카드와 3D 시뮬레이션으로 과학을 재미있게 배워보세요.",
    url: 'https://science-learning.vercel.app',
    siteName: '과학 학습실',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '과학 학습실 - 중학교 과학 교육 플랫폼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "과학 학습실 - 중1,2,3학년 과학 교육",
    description: "중학교 과학 교육을 위한 인터랙티브 학습 플랫폼",
    images: ['/og-image.png'],
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
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#667eea" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
