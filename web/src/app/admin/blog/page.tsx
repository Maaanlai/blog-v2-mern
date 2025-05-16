"use client";

import { ActionIcon, Button, Flex, Stack, Table } from "@mantine/core";
import { useSearchBlogsMutation } from "../../../../api/blog";
import { useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";

function BlogPage() {
  const [searchBlogs, { data: blogList }] = useSearchBlogsMutation();

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
      <Flex justify={"end"} px={"md"}>
        <ActionIcon size={"md"} fw={400}>
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
