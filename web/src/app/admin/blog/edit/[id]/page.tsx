"use client";

import { useParams } from "next/navigation";
import { useGetBlogByIdMutation } from "../../../../../../api/blog";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Flex, Select, Stack, TextInput } from "@mantine/core";
import BlogEditor from "../../../../../../components/blog-editor";
import "@mantine/tiptap/styles.css";

const tagTypes = [
  { value: "1", label: "News" },
  { value: "2", label: "Updates" },
  { value: "3", label: "Events" },
];

function page() {
  const [getBlogById, { data: blogData }] = useGetBlogByIdMutation();
  const { id } = useParams<{ id: string }>();
  const [tagSelectValue, setTagSelectValue] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      title: "",
      des: "",
      banner: "",
      content: "",
    },
  });

  useEffect(() => {
    if (blogData) {
      form.setValues({
        title: blogData?.blog?.title,
        des: blogData?.blog?.des,
        banner: blogData?.blog?.banner,
        content: blogData?.blog?.content,
      });
    }
  }, [blogData]);

  useEffect(() => {
    getBlogById({ id });
  }, []);

  return (
    <Stack>
      <Flex gap={50}>
        <form
          onSubmit={form.onSubmit((values) => {
            console.log(values);
            // updatePage(values);
          })}
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <TextInput label="Title" {...form.getInputProps("title")} />
          <TextInput label="Description" {...form.getInputProps("des")} />
          <TextInput label="Thumbnail" {...form.getInputProps("thumbnail")} />
          <Button type="submit" aria-label="Submit">
            Save Content
          </Button>
        </form>
        <Stack maw={400} gap={10}>
          <Select
            label="Tags"
            searchable
            multiple
            data={tagTypes}
            value={tagSelectValue}
            onChange={(value: string | null) => {
              if (value) {
                setTagSelectValue(null);
              }
            }}
          />
          <Flex gap={5} wrap={"wrap"}>
            {blogData?.blog?.tags?.map((tag: string, index: number) => {
              return (
                <Button key={index} size="compact-md" variant="outline">
                  {tag}
                </Button>
              );
            })}
          </Flex>
        </Stack>
      </Flex>
      <BlogEditor
        blogId={blogData?.blog?.blog_id || ""}
        content={blogData?.blog?.content || ""}
      />
    </Stack>
  );
}

export default page;
