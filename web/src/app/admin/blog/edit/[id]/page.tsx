"use client";

import { useParams } from "next/navigation";
import {
  useCreateBlogMutation,
  useGetBlogByIdMutation,
  useLazyGetUploadURLQuery,
} from "../../../../../../api/blog";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  FileInput,
  Flex,
  Image,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import BlogEditor from "../../../../../../components/blog-editor";
import "@mantine/tiptap/styles.css";
import { notifications } from "@mantine/notifications";

const tagTypes = [
  { value: "1", label: "News" },
  { value: "2", label: "Updates" },
  { value: "3", label: "Events" },
];

function page() {
  const { id } = useParams<{ id: string }>();
  const [getBlogById, { data: blogData }] = useGetBlogByIdMutation();
  const [createBlog] = useCreateBlogMutation();
  const [tagSelectValue, setTagSelectValue] = useState<string | null>(null);
  const [getUploadUrl] = useLazyGetUploadURLQuery({});

  const form = useForm({
    initialValues: {
      id: id,
      title: "",
      des: "",
      banner: "",
      content: "",
    },
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    try {
      const { uploadUrl } = await getUploadUrl({}).unwrap();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const s3Url = uploadUrl.split("?")[0];

      form.setFieldValue("banner", s3Url);

      notifications.show({ message: "Banner uploaded!", color: "green" });
    } catch (err) {
      notifications.show({ message: "Upload failed", color: "red" });
    }
  };

  useEffect(() => {
    if (blogData) {
      form.setValues({
        id: blogData?.blog?.blog_id,
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
            createBlog(values).then(() =>
              notifications.show({ message: "Blog edited!", color: "green" })
            );
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
          <FileInput
            label="Banner"
            placeholder="Upload file"
            onChange={handleFileChange}
          />
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
          <Button type="submit" aria-label="Submit">
            Save Content
          </Button>
        </form>
        <Stack maw={400} gap={10}>
          {form.values.banner && (
            <Image
              src={form.values.banner}
              alt="Banner"
              width={200}
              height={100}
            />
          )}
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
