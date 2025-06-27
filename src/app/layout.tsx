import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Poppins } from 'next/font/google';
import "../styles/globals.css";
import { AuthProvider } from '../contexts/AuthContext';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Weavory",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${poppins.variable}`}>
      <body
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
