import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import {
  AppShell,
  ColorSchemeScript,
  MantineProvider,
  Stack,
  mantineHtmlProps,
} from "@mantine/core";
import { HeaderSearch } from "../../components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lorem - Blog Website",
  description: "Blog website built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <ReduxProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <MantineProvider forceColorScheme="light">
            <Stack w={"100%"} justify="start" mt={0} style={{ padding: "5px" }}>
              <HeaderSearch />
              {children}
            </Stack>
          </MantineProvider>
        </body>
      </ReduxProvider>
    </html>
  );
}
