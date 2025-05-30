import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import Footer from "./components/Footer";
import SocketWrapper from "./socketWrapper";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuipQuest",
  description: "Where wit meets laughter!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <ClientProvider>
            <SocketWrapper>{children}</SocketWrapper>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
