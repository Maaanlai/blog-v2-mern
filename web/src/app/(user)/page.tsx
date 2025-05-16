"use client";

import {
  Avatar,
  BackgroundImage,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { useGetLastestBlogsMutation } from "../../../api/blog";
import { useEffect } from "react";
import { motion } from "motion/react";

export default function Home() {
  const [getLatestBlogs, { isLoading, data: blogResponse }] =
    useGetLastestBlogsMutation();

  useEffect(() => {
    getLatestBlogs({});
  }, []);

  return (
    <Flex
      p={"lg"}
      direction={"column"}
      gap={16}
      justify={"center"}
      ml={{
        base: 0,
        sm: 0,
        md: "10%",
        lg: "20%",
      }}
      w={{
        base: "100%",
        sm: "100%",
        md: "80%",
        lg: "60%",
      }}
    >
      <Text
        fw={"bold"}
        style={{
          fontSize: "2rem",
        }}
      >
        Welcome to Lorem
      </Text>
      {blogResponse?.blogs && blogResponse?.blogs?.length > 0 && (
        <motion.div
          transition={{ duration: 0.2 }}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            window.location.href = `/blog/${blogResponse?.blogs[0].blog_id}`;
          }}
        >
          <BackgroundImage
            src={blogResponse?.blogs[0]?.banner}
            radius="md"
            h={500}
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "end",
              color: "#fff",
            }}
          >
            <Flex
              p="lg"
              direction={"column"}
              gap={4}
              w={"100%"}
              style={{
                background: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <Text size="xl">{blogResponse?.blogs[0]?.title}</Text>
              <Text size="lg" mt={8}>
                {blogResponse?.blogs[0]?.des}
              </Text>
              <Group mt={8}>
                <Avatar
                  src={blogResponse?.blogs[0].author.personal_info.profile_img}
                />
                <Text size="sm">
                  {blogResponse?.blogs[0].author.personal_info.fullName}
                </Text>
                <Text size="sm">
                  {new Date(
                    blogResponse?.blogs[0].publishedAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Group>
            </Flex>
          </BackgroundImage>
        </motion.div>
      )}

      <Text size={"xl"} fw={"bold"}>
        Latest Blogs
      </Text>
      <Grid gutter="lg">
        {blogResponse?.blogs?.map((blog) => (
          <Grid.Col
            key={blog.blog_id}
            span={{
              base: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <motion.div
              transition={{ duration: 0.2 }}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = `/blog/${blog.blog_id}`;
              }}
            >
              <Card padding={"lg"} radius="md">
                <Card.Section>
                  <Flex h={200} justify={"center"} align={"center"}>
                    <Image src={blog.banner} h={200} fit="contain" />
                  </Flex>
                </Card.Section>
                <Text mt={8} fw={"bold"} size="xl">
                  {blog.title}
                </Text>
                <Text mt={8}>{blog.des}</Text>
                <Group mt={8}>
                  <Avatar src={blog.author.personal_info.profile_img} />
                  <Text size="sm">{blog.author.personal_info.fullName}</Text>
                  <Text size="sm">
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </Group>
              </Card>
            </motion.div>
          </Grid.Col>
        ))}
      </Grid>
    </Flex>
  );
}
