"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetBlogByIdMutation } from "../../../../../api/blog";
import { Badge, Button, Chip, Flex, Text } from "@mantine/core";

function page() {
  const [getBlogById, { data: blogData }] = useGetBlogByIdMutation();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    getBlogById({ id: params.id });
  }, []);

  useEffect(() => {
    console.log("blogData", blogData);
  }, [blogData]);

  return (
    <Flex direction={"column"} p={"lg"}>
      <Text fw={"bold"} style={{ fontSize: "2rem" }}>
        {blogData?.blog?.title}
      </Text>

      <Text mt={16} size={"sm"} color={"dimmed"}>
        {blogData?.blog?.des}
      </Text>
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
      <Text mt={16} size={"sm"} color={"dimmed"}>
        {blogData?.blog?.publishedAt}
      </Text>
      <Text mt={16} size={"sm"} color={"dimmed"}>
        {blogData?.blog?.author?.personal_info?.username}
      </Text>
    </Flex>
  );
}

export default page;
