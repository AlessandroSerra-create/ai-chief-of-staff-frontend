import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chief of Staff",
  description: "AI Chief of Staff Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
