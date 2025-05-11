import type { Metadata } from "next";
import { Stack } from "@mantine/core";
import { HeaderSearch } from "../../../components/header";

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
    <Stack w={"100%"} justify="start" mt={0} style={{ padding: "5px" }}>
      <HeaderSearch />
      {children}
    </Stack>
  );
}
