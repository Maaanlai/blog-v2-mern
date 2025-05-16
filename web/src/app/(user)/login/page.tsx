"use client";
import {
  Anchor,
  Button,
  Card,
  Flex,
  Text,
  TextInput,
  Title,
  Notification,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "../../../../api/auth";
import { useAuth } from "@/providers/AuthProvider";
/* eslint-disable @typescript-eslint/no-explicit-any */

function Login() {
  const router = useRouter();
  const { setToken, isAuthenticated } = useAuth();

  const [login, { data: loginResponse, error: loginErrorMessage }] =
    useLoginMutation();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Invalid email address"),
      password: (value: string) => {
        if (value.length < 6) {
          return "Password is too short";
        }
      },
    },
  });

  useEffect(() => {
    if (loginResponse?.user && loginResponse?.user?.access_token) {
      localStorage.setItem("token", loginResponse?.user?.access_token);
      setToken(loginResponse?.user?.access_token);
      router.push("/");
    }
  }, [loginResponse]);

  return (
    <Flex w={"100%"} justify="center" h={"100vh"} mt={"5rem"}>
      <Card
        shadow="md"
        w={{
          base: "80%",
          md: 500,
        }}
        h={"500"}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            gap: "1rem",
          }}
          onSubmit={form.onSubmit((values) => {
            login(values);
          })}
        >
          <Title order={2}>Sign In</Title>
          {loginErrorMessage &&
            "data" in loginErrorMessage &&
            (loginErrorMessage as any)?.data?.message && (
              <Notification color="red" w={"90%"} withCloseButton={false}>
                {(loginErrorMessage as any)?.data?.message}
              </Notification>
            )}
          <TextInput w={"90%"} label="Email" {...form.getInputProps("email")} />
          <TextInput
            w={"90%"}
            label="Password"
            type="password"
            {...form.getInputProps("password")}
          />
          <Button w={"90%"} type="submit" aria-label="Login">
            Login
          </Button>
          <Text c={"dimmed"}>
            Don&apos;t have an account yet?{" "}
            <Anchor href="/register">Sign up</Anchor>
          </Text>
        </form>
      </Card>
    </Flex>
  );
}

export default Login;
