"use client";

import { Breadcrumbs, Paper, ScrollArea, Stack, Title } from "@mantine/core";
import classes from "./layout.module.css";
import Sidebar from "./components/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GoDotFill as BreadcrumbsSeparator } from "react-icons/go";

const pathnameToBreadcrumbs = (pathname: string) => {
  if (pathname.startsWith("/admin/user")) {
    return [
      { href: "/admin", label: "Home" },
      { href: "/admin/user", label: "Users" },
    ];
  } else if (pathname.startsWith("/admin/blog")) {
    return [
      { href: "/admin", label: "Home" },
      { href: "/admin/blog", label: "Blog" },
    ];
  } else if (pathname?.startsWith("/admin")) {
    return [
      { href: "/admin", label: "Home" },
      { href: "#", label: "" },
    ];
  } else {
    return [];
  }
};

const pathnameToLabel = (pathname: string) => {
  if (pathname.startsWith("/admin/user")) {
    return "Users";
  } else if (pathname.startsWith("/admin/blog")) {
    return "Blog";
  } else if (pathname?.startsWith("/admin")) {
    return "Home";
  } else {
    return "";
  }
};

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={classes.root}>
      <Paper className={classes.sidebarWrapper} withBorder>
        <ScrollArea flex="1" px="md" miw={"300px"}>
          <Sidebar />
        </ScrollArea>
      </Paper>
      <div className={classes.content}>
        <Stack p={10}>
          <Title order={2}>{pathnameToLabel(pathname)}</Title>
          <Breadcrumbs
            separator={
              <BreadcrumbsSeparator
                size="0.5rem"
                color="var(--mantine-color-dimmed)"
                opacity={0.4}
              />
            }
          >
            {pathnameToBreadcrumbs(pathname).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </Breadcrumbs>
          {children}
        </Stack>
      </div>
    </div>
  );
}

export default AdminLayout;
