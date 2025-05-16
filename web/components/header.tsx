"use client";

import { IconSearch } from "@tabler/icons-react";
import { Autocomplete, Burger, Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import Logo from "./logo";
import { useRouter } from "next/navigation";

const links = [
  { link: "/about", label: "Бидний Тухай" },
  { link: "/contact", label: "Холбогдох" },
];

export function HeaderSearch() {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <Text
      key={link.label}
      className={classes.link}
      component="a"
      href={link.link}
      style={{
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <Logo />
        </Group>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          />
          <Button
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
        </Group>
      </div>
    </header>
  );
}
