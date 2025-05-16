"use client";

import {
  ActionIcon,
  Button,
  FileInput,
  Flex,
  Image,
  Modal,
  Stack,
  Table,
  TextInput,
} from "@mantine/core";
import {
  useCreateBlogMutation,
  useLazyGetUploadURLQuery,
  useSearchBlogsMutation,
} from "../../../../api/blog";
import { useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

function BlogPage() {
  const [searchBlogs, { data: blogList }] = useSearchBlogsMutation();
  const [opened, { open, close }] = useDisclosure(false);
  const [getUploadUrl] = useLazyGetUploadURLQuery({});
  const [createBlog] = useCreateBlogMutation();

  const createForm = useForm({
    initialValues: {
      title: "",
      content: "",
      des: "",
      banner: "",
    },
    validate: {
      title: (value) => (value.length < 5 ? "Title is too short" : null),
      content: (value) => (value.length < 20 ? "Content is too short" : null),
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

      createForm.setFieldValue("banner", s3Url);

      notifications.show({ message: "Banner uploaded!", color: "green" });
    } catch (err) {
      notifications.show({ message: "Upload failed", color: "red" });
    }
  };

  const rows = blogList?.blogs?.map((blog, index) => (
    <Table.Tr
      key={index}
      style={{
        transition: "background 0.2s",
        cursor: "pointer",
        alignItems: "center",
      }}
    >
      <Table.Td>{blog.title}</Table.Td>
      <Table.Td>{blog.author.personal_info.username}</Table.Td>
      <Table.Td>
        {blog.tags?.map((tag, index) => {
          return (
            <Button
              key={index}
              size="compact-sm"
              fw={400}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                marginRight: "4px",
              }}
            >
              {tag}
            </Button>
          );
        })}
      </Table.Td>
      <Table.Td>{blog.activity.total_likes}</Table.Td>
      <Table.Td>{blog.activity.total_comments}</Table.Td>
      <Table.Td>{blog.activity.total_reads}</Table.Td>
      <Table.Td>
        <Flex gap={5}>
          <Button
            onClick={() => {
              window.location.href = `/admin/blog/edit/${blog.blog_id}`;
            }}
          >
            Edit
          </Button>
          <Button variant="outline" color={"red"}>
            Delete
          </Button>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    searchBlogs({});
  }, []);

  return (
    <Stack>
      <Modal opened={opened} onClose={close} title="Create Blog">
        <form>
          <Stack>
            <TextInput
              label="Title"
              onChange={(e) => {
                createForm.setFieldValue("title", e.currentTarget.value);
              }}
              value={createForm.values.title}
              required
            />
            <TextInput
              label="Description"
              onChange={(e) =>
                createForm.setFieldValue("des", e.currentTarget.value)
              }
              value={createForm.values.des}
            />
            <FileInput
              label="Banner"
              placeholder="Upload file"
              onChange={handleFileChange}
            />
            {createForm.values.banner && (
              <Image
                src={createForm.values.banner}
                alt="Banner"
                width={200}
                height={100}
              />
            )}
            <Button
              onClick={() => {
                createBlog(createForm.values).then(() => {
                  close();
                  searchBlogs({});
                });
              }}
            >
              Create
            </Button>
          </Stack>
        </form>
      </Modal>
      <Flex justify={"end"} px={"md"}>
        <ActionIcon
          size={"md"}
          fw={400}
          onClick={() => {
            open();
          }}
        >
          <IconPlus />
        </ActionIcon>
      </Flex>
      <Table border={1} striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Tags</Table.Th>
            <Table.Th>Likes</Table.Th>
            <Table.Th>Comments</Table.Th>
            <Table.Th>Reads</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}

export default BlogPage;
