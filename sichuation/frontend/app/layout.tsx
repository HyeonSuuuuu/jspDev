import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Shell } from "@/components/Layout/Shell";
import "./globals.css";
import '@mantine/core/styles.css';

export const metadata: Metadata = {
  title: "Sichuation",
  description: "Situation awareness platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Shell>
            {children}
          </Shell>
        </MantineProvider>
      </body>
    </html>
  );
}
