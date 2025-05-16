import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSeenInformation } from "@/app/queries";
import { Header } from "@/app/components/Header";
import { Providers } from "@/app/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Сімпсони без реклами",
  description: "Дивіться Сімпсони без реклами онлайн",
};

export const revalidate = 2;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seenCount = await getSeenInformation();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Сімпсони без реклами" />
        <meta name="keywords" content="Сімпсони, без реклами, онлайн" />
        <meta name="author" content="Сімпсони без реклами" />
        <meta name="robots" content="index, follow" />
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col text-gray-800 dark:bg-black dark:text-gray-400`}
      >
        <Providers value={{
          episodes: String(seenCount.episodes),
          seen: String(seenCount.seen)
        }}>
          <Header />
          <main className="flex-1">
            <div className="container px-8 mx-auto xl:px-5  max-w-(--breakpoint-lg) relative">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
