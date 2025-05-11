"use client";

import Link from "next/link";
import { AppShell, Burger, NavLink, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./sidebar.module.css";
import { MenuItem } from "./menu-sections";
import { menu } from "./menu-sections";
import { usePathname } from "next/navigation";

const navbarItems = [
  {
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    label: "Users",
    icon: "users",
  },
  {
    label: "Blogs",
    icon: "blogs",
  },
];

function layout() {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Navbar>
        <Stack gap="xl" py={20} px={10}>
          {menu.map((item: MenuItem) => (
            <div key={item.header}>
              <Title order={6} className={classes.sectionTitle}>
                {item.header}
              </Title>

              {item.section.map((subItem) =>
                subItem.dropdownItems ? (
                  <NavLink
                    variant="subtle"
                    key={subItem.name}
                    label={subItem.name}
                    childrenOffset={0}
                    className={classes.sectionLink}
                    active={pathname.includes(subItem.href)}
                    leftSection={subItem.icon && <subItem.icon />}
                  >
                    {subItem.dropdownItems?.map((dropdownItem) => (
                      <NavLink
                        variant="subtle"
                        component={Link}
                        href={dropdownItem.href}
                        key={dropdownItem.name}
                        label={dropdownItem.name}
                        active={pathname.includes(dropdownItem.href)}
                        className={classes.sectionDropdownItemLink}
                        leftSection={<span className="dot" />}
                      />
                    ))}
                  </NavLink>
                ) : (
                  <NavLink
                    variant="subtle"
                    component={Link}
                    href={subItem.href}
                    key={subItem.name}
                    label={subItem.name}
                    className={classes.sectionLink}
                    leftSection={subItem.icon && <subItem.icon />}
                  />
                )
              )}
            </div>
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <p>Main</p>
      </AppShell.Main>
    </AppShell>
  );
}

export default layout;
