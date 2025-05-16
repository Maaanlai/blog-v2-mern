"use client";

import { IconLogout, IconSearch, IconUser } from "@tabler/icons-react";
import {
  Autocomplete,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import Logo from "./logo";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "../api/auth";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

const links = [
  { link: "/about", label: "Бидний Тухай" },
  { link: "/contact", label: "Холбогдох" },
];

export function HeaderSearch() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [opened, { toggle }] = useDisclosure(false);
  const { data: userData, refetch, isLoading, isError } = useGetMeQuery({});

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

  useEffect(() => {
    refetch();
    console.log("Changed");
  }, [token, isAuthenticated]);

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
          {isLoading ? (
            <Skeleton height={"100%"} width={100} />
          ) : !isError && userData?.user?.personal_info?.fullName ? (
            <Menu trigger="hover" width={200}>
              <Menu.Target>
                <Group>
                  <Avatar src={userData?.user?.personal_info?.profile_img} />
                  <Text size="sm">
                    {userData?.user?.personal_info?.fullName}
                  </Text>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => {
                    router.push("/admin");
                  }}
                >
                  Admin
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={() => {
                    localStorage.removeItem("token");
                    refetch();
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          )}
        </Group>
      </div>
    </header>
  );
}
