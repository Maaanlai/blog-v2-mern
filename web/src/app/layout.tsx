import {
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import { ReduxProvider } from "@/providers/ReduxProvider";

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
});

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ReduxProvider>{children}</ReduxProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
