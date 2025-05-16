"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetBlogByIdMutation } from "../../../../../api/blog";
import {
  Avatar,
  Button,
  Flex,
  Group,
  Image,
  Skeleton,
  Text,
} from "@mantine/core";
import "./blog.css";

function BlogList() {
  const [getBlogById, { data: blogData, isLoading }] = useGetBlogByIdMutation();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    getBlogById({ id: params.id });
  }, []);

  return (
    <Flex direction={"column"} p={"lg"} align={"center"}>
      {isLoading || !blogData ? (
        <Skeleton height={"600px"} width={"50%"} />
      ) : (
        <></>
      )}
      <Flex
        w={{
          base: "90%",
          sm: "90%",
          md: "60%",
          lg: "50%",
          xl: "50%",
        }}
        direction="column"
        gap={10}
      >
        <Image src={blogData?.blog?.banner} />
        <Text fw={"bold"} style={{ fontSize: "2rem" }}>
          {blogData?.blog?.title}
        </Text>
        <Group mt={8}>
          <Avatar
            src={blogData?.blog.author.personal_info.profile_img}
            alt="profile"
          />
          <Text size="sm">{blogData?.blog.author.personal_info.fullName}</Text>
          <Text size="sm">
            {blogData?.blog.publishedAt &&
              new Date(blogData?.blog.publishedAt ?? "").toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
          </Text>
        </Group>
        {blogData?.blog?.tags?.map((item, index) => {
          return (
            <Button
              key={index}
              mt={16}
              size={"sm"}
              variant="outline"
              w={"fit-content"}
            >
              {item}
            </Button>
          );
        })}
        {blogData?.blog && blogData?.blog?.content && (
          <div
            style={{
              marginTop: "20px",
            }}
            className="blog-viewer"
            dangerouslySetInnerHTML={{ __html: blogData.blog.content }}
          />
        )}
      </Flex>
    </Flex>
  );
}

export default BlogList;
